package services

import (
	"fmt"
	"os"
	"sync"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

var (
	client *openai.Client
	once   sync.Once
)

// InitOpenAI initializes the OpenAI client
func InitOpenAI() error {
	var initErr error
	once.Do(func() {
		apiKey := os.Getenv("OPENAI_API_KEY")
		if apiKey == "" {
			initErr = fmt.Errorf("OPENAI_API_KEY environment variable is not set")
			return
		}

		client = openai.NewClient(
			option.WithAPIKey(apiKey),
		)
	})
	return initErr
}

// GetOpenAIClient returns the initialized OpenAI client
func GetOpenAIClient() *openai.Client {
	if client == nil {
		if err := InitOpenAI(); err != nil {
			// Log the error but return nil client - handlers will need to check for nil
			fmt.Printf("Failed to initialize OpenAI client: %v\n", err)
			return nil
		}
	}
	return client
}
