package main

import (
	"net/http"

	"github.com/mb-dev/plot-my-trip/api"
)

func registerAPIService() {
	http.HandleFunc("/api", api.Handler)
	http.HandleFunc("/auth/google", api.AuthGoogleHandler)
}

func registerStaticFiles() {
	dir := http.FileServer(http.Dir("static/"))
	http.Handle("/css/", dir)
	http.Handle("/js/", dir)
	http.Handle("/html/", dir)
	http.Handle("/", dir)
}

func main() {
	registerStaticFiles()
	registerAPIService()

	http.ListenAndServe(":4000", nil)
}
