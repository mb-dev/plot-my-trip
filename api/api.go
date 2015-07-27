package api

import (
	"encoding/json"
	"net/http"
)

// Handler handles api calls
func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	data := map[string]interface{}{
		"hello": "world",
	}
	response, _ := json.Marshal(data)
	w.Write(response)
}
