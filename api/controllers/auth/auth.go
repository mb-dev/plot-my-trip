package auth

import (
	"encoding/json"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/mb-dev/plot-my-trip/api/lib/auth"
	"github.com/mb-dev/plot-my-trip/api/lib/context"
)

func authGoogleHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	url, err := auth.GetAuthURL()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Write([]byte(url))
}

type tokenizeRequest struct {
	State string `json:"state"`
	Code  string `json:"code"`
}

func tokenizeHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	decoder := json.NewDecoder(r.Body)
	var body tokenizeRequest
	err := decoder.Decode(&body)
	if err != nil {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}
	tokenString, err := auth.TokenizeHandler(body.State, body.Code)
	if err != nil {
		http.Error(w, "error getting token "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Write([]byte(tokenString))
}

type userResponse struct {
	Name string `json:"name"`
}

func getUserHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params, context context.Context) {
	response := userResponse{Name: context.User.Name}
	responseJSON, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}

// RegisterRoutes adds trip routers to the router
func RegisterRoutes(router *httprouter.Router) {
	router.GET("/api/auth/google", authGoogleHandler)
	router.GET("/api/auth/get-user", auth.RequireBearerMiddleware(getUserHandler))
	router.POST("/api/auth/tokenize", tokenizeHandler)
}
