package api

import (
	"encoding/json"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	data := map[string]interface{}{
		"hello": "world",
	}
	response, _ := json.Marshal(data)
	w.Write(response)
}

func registerAPIService() {
	http.HandleFunc("/api", handler)
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

	http.ListenAndServe(":8080", nil)
}
