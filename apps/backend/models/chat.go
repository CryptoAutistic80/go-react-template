package models

// ChatRequest represents an incoming chat message request
type ChatRequest struct {
	ChatID  string `json:"chatId,omitempty"`
	Message string `json:"message"`
	Model   string `json:"model"`
}

// ChatResponse represents a response from the chat API
type ChatResponse struct {
	Message string `json:"message,omitempty"`
	Error   string `json:"error,omitempty"`
}

// StreamResponse represents a streaming response chunk
type StreamResponse struct {
	Type    string      `json:"type"`              // "message", "error", "done", or "tool"
	Content string      `json:"content,omitempty"` // Used for message type
	Error   string      `json:"error,omitempty"`   // Used for error type
	Data    interface{} `json:"data,omitempty"`    // Used for tool calls
}
