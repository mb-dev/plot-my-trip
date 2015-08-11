package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/mb-dev/plot-my-trip/api"
	"github.com/mb-dev/plot-my-trip/api/config"
	"github.com/mb-dev/plot-my-trip/api/lib/auth"
)

func serveCallback(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	http.ServeFile(w, r, "static/handleCallback.html")
}

func registerRoutes(router *httprouter.Router) {
	router.NotFound = http.FileServer(http.Dir("static"))

	router.GET("/auth/google/callback", serveCallback)
}

func main() {
	config.LoadConfiguration()
	auth.Initialize()

	router := httprouter.New()
	registerRoutes(router)
	api.Initialize(router)

	fmt.Println("Starting server on port 4000...")
	log.Fatal(http.ListenAndServe(":4000", router))
}
