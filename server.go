package main

import (
	"fmt"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/mb-dev/plot-my-trip/api"
)

func serverIndex(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	http.ServeFile(w, r, "static/index.html")
}

func main() {
	router := httprouter.New()
	router.NotFound = http.FileServer(http.Dir("static"))

	router.GET("/auth/google/callback", serverIndex)

	api.RegisterAPIService(router)

	fmt.Println("Starting server on port 4000...")
	http.ListenAndServe(":4000", router)
}
