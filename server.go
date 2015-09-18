package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/mb-dev/plot-my-trip/api"
	"github.com/mb-dev/plot-my-trip/api/config"
	"github.com/mb-dev/plot-my-trip/api/lib/auth"
	"github.com/rs/cors"
)

func serveIndex(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "static/index.html")
}

func registerRoutes(router *httprouter.Router) {
	router.NotFound = http.HandlerFunc(serveIndex)
	router.Handler("GET", "/js/*file", http.StripPrefix("/js/", http.FileServer(http.Dir("static/"))))
	router.Handler("GET", "/css/*file", http.StripPrefix("/css/", http.FileServer(http.Dir("static/"))))
}

func main() {
	config.LoadConfiguration()
	auth.Initialize()

	router := httprouter.New()
	api.Initialize(router)
	registerRoutes(router)

	fmt.Println("Starting server on port 8000...")
	handler := cors.New(cors.Options{AllowedHeaders: []string{"Accept", "Content-Type", "Authorization"}}).Handler(router)
	log.Fatal(http.ListenAndServe(":8000", handler))
}
