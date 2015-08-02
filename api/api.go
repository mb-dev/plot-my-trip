package api

import (
	"encoding/json"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/mb-dev/plot-my-trip/api/auth"
)

// Handler handles api calls
func apiHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	w.Header().Set("Content-Type", "application/json")
	data := map[string]interface{}{
		"hello": "world",
	}
	response, _ := json.Marshal(data)
	w.Write(response)
}

func authGoogleHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	url := auth.GetAuthURL()
	w.Write([]byte(url))
}

func RegisterAPIService(router *httprouter.Router) {
	router.GET("/api", apiHandler)
	router.GET("/api/auth/google", authGoogleHandler)
}
