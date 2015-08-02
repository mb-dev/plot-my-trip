package auth

import "github.com/mb-dev/plot-my-trip/api/auth/google"

func GetAuthURL() string {
	url := google.Config.AuthCodeURL("state")
	return url
}

func HandleCallback(code string) {
	google.HandleCallback(code)
}
