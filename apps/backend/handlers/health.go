package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// HealthCheckHandler returns the health status of the server
func HealthCheckHandler(w http.ResponseWriter, r *http.Request) {
	response := struct {
		Status    string    `json:"status"`
		Timestamp time.Time `json:"timestamp"`
	}{
		Status:    "healthy",
		Timestamp: time.Now(),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		fmt.Printf("Error encoding response: %v\n", err)
	}
}
