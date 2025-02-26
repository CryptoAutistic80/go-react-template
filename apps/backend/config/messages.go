package config

// SystemMessages stores different system messages for different contexts
var SystemMessages = map[string]string{
	"default": `You are a helpful AI assistant. You provide clear, accurate, and concise responses.`,
	"code":    `You are a helpful AI coding assistant. You provide clear, accurate, and helpful code-related responses.`,
}

// GetSystemMessage returns the system message for the given context
func GetSystemMessage(context string) string {
	if msg, ok := SystemMessages[context]; ok {
		return msg
	}
	return SystemMessages["default"]
}
