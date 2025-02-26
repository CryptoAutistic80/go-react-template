package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/sshiftdao/go-react-template/backend/config"
	"github.com/sshiftdao/go-react-template/backend/models"
	"github.com/sshiftdao/go-react-template/backend/services"

	"github.com/openai/openai-go"
)

// QueryHandler handles chat messages
func QueryHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") // Update this for production
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		json.NewEncoder(w).Encode(models.ChatResponse{Error: "Invalid request format"})
		return
	}

	// Validate required fields
	if req.Message == "" || req.Model == "" {
		json.NewEncoder(w).Encode(models.ChatResponse{Error: "Message and model are required"})
		return
	}

	// Get OpenAI client
	client := services.GetOpenAIClient()

	// Create completion request
	completion, err := client.Chat.Completions.New(r.Context(), openai.ChatCompletionNewParams{
		Messages: openai.F([]openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(config.GetSystemMessage("default")),
			openai.UserMessage(req.Message),
		}),
		Model: openai.F(req.Model),
	})

	if err != nil {
		json.NewEncoder(w).Encode(models.ChatResponse{Error: err.Error()})
		return
	}

	response := models.ChatResponse{
		Message: completion.Choices[0].Message.Content,
	}

	json.NewEncoder(w).Encode(response)
}

// StreamQueryHandler handles streaming chat responses
func StreamQueryHandler(w http.ResponseWriter, r *http.Request) {
	// Set headers for SSE
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("X-Accel-Buffering", "no") // Disable buffering for nginx

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendSSEError(w, "Invalid request format")
		return
	}

	if req.Message == "" || req.Model == "" {
		sendSSEError(w, "Message and model are required")
		return
	}

	// Get OpenAI client
	client := services.GetOpenAIClient()
	if client == nil {
		sendSSEError(w, "OpenAI client not initialized")
		return
	}

	// Create streaming completion request
	stream := client.Chat.Completions.NewStreaming(r.Context(), openai.ChatCompletionNewParams{
		Messages: openai.F([]openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(config.GetSystemMessage("default")),
			openai.UserMessage(req.Message),
		}),
		Model: openai.F(req.Model),
	})

	// Stream the response
	flusher, ok := w.(http.Flusher)
	if !ok {
		sendSSEError(w, "Streaming not supported")
		return
	}

	for stream.Next() {
		chunk := stream.Current()

		// Send each delta content chunk immediately
		if len(chunk.Choices) > 0 && chunk.Choices[0].Delta.Content != "" {
			sendSSEMessage(w, chunk.Choices[0].Delta.Content)
			flusher.Flush()
		}

		// Handle any tool calls
		if len(chunk.Choices) > 0 && chunk.Choices[0].Delta.ToolCalls != nil {
			for _, toolCall := range chunk.Choices[0].Delta.ToolCalls {
				toolData := map[string]interface{}{
					"type": "tool",
					"data": toolCall,
				}
				sendSSEData(w, toolData)
				flusher.Flush()
			}
		}
	}

	if err := stream.Err(); err != nil {
		sendSSEError(w, err.Error())
		return
	}

	// Send completion message
	sendSSEData(w, map[string]interface{}{
		"type": "done",
	})
	flusher.Flush()
}

// Helper functions for SSE
func sendSSEMessage(w http.ResponseWriter, message string) {
	data := map[string]interface{}{
		"type":    "message",
		"content": message,
	}
	jsonData, err := json.Marshal(data)
	if err != nil {
		sendSSEError(w, "Error encoding message")
		return
	}
	fmt.Fprintf(w, "data: %s\n\n", string(jsonData))
}

func sendSSEData(w http.ResponseWriter, data interface{}) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		sendSSEError(w, "Error encoding response")
		return
	}
	fmt.Fprintf(w, "data: %s\n\n", string(jsonData))
}

func sendSSEError(w http.ResponseWriter, message string) {
	errorData := map[string]interface{}{
		"type":  "error",
		"error": message,
	}
	sendSSEData(w, errorData)
}
