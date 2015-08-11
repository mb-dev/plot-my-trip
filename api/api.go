package api

import (
	"encoding/json"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/mb-dev/plot-my-trip/api/db"
	"github.com/mb-dev/plot-my-trip/api/lib/auth"
)

// Handler handles api calls
func authGoogleHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	url := auth.GetAuthURL()
	w.Write([]byte(url))
}

type TokenizeRequest struct {
	State string `json:"state"`
	Code  string `json:"code"`
}

func tokenizeHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	decoder := json.NewDecoder(r.Body)
	var body TokenizeRequest
	err := decoder.Decode(&body)
	if err != nil {
		http.Error(w, "invalid input", http.StatusBadRequest)
	}
	tokenString, err := auth.TokenizeHandler(body.State, body.Code)
	if err != nil {
		http.Error(w, "error getting token "+err.Error(), http.StatusInternalServerError)
	}
	w.Write([]byte(tokenString))
}

func registerRoutes(router *httprouter.Router) {
	router.GET("/api/auth/google", authGoogleHandler)
	router.POST("/api/auth/tokenize", tokenizeHandler)
}

func Initialize(router *httprouter.Router) error {
	if err := db.Connect("127.0.0.1"); err != nil {
		return err
	}
	registerRoutes(router)
	return nil
}

func Destroy() {
	db.Disconnect()
}
