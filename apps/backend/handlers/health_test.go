package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestHealthCheckHandler(t *testing.T) {
	// Create a request to pass to our handler
	req, err := http.NewRequest("GET", "/api/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Create a ResponseRecorder to record the response
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HealthCheckHandler)

	// Call the handler directly
	handler.ServeHTTP(rr, req)

	// Check the status code
	assert.Equal(t, http.StatusOK, rr.Code, "handler returned wrong status code")

	// Parse the response body
	var response struct {
		Status    string    `json:"status"`
		Timestamp time.Time `json:"timestamp"`
	}

	err = json.NewDecoder(rr.Body).Decode(&response)
	assert.NoError(t, err, "failed to decode response body")

	// Check the response fields
	assert.Equal(t, "healthy", response.Status, "handler returned wrong status")
	assert.False(t, response.Timestamp.IsZero(), "handler returned zero timestamp")
	assert.True(t, time.Since(response.Timestamp) < time.Minute, "timestamp should be recent")
}
