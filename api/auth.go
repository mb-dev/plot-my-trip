package api

import (
	"net/http"

	"github.com/mb-dev/plot-my-trip/api/auth"
)

func AuthGoogleHandler(w http.ResponseWriter, r *http.Request) {
	var url = auth.Oauth2Config().AuthCodeURL("state")
	w.Write([]byte(url))
}
