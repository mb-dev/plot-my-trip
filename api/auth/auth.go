package auth

import (
	"log"

	"github.com/dgrijalva/jwt-go"
	"github.com/mb-dev/plot-my-trip/api/auth/google"
	"github.com/mb-dev/plot-my-trip/api/config"
	"github.com/mb-dev/plot-my-trip/api/db"
	"golang.org/x/oauth2"
)

// GetAuthURL returns URL to authenticate with Google
func GetAuthURL() string {
	url := google.Config.AuthCodeURL("state", oauth2.AccessTypeOffline)
	return url
}

// TokenizeHandler handles the callback code and will create a user
func TokenizeHandler(state string, code string) (string, error) {
	tokenString := ""

	userDetails, err := google.GetUserFromCode(state, code)
	if err != nil {
		log.Println(err)
		return tokenString, err
	}

	user, err := db.FindAndUpdateOrCreateUser(userDetails)
	if err != nil {
		log.Println(err)
		return tokenString, err
	}

	token := jwt.New(jwt.SigningMethodHS256)
	token.Claims["user"] = user.Id
	token.Claims["email"] = user.Email
	tokenString, err = token.SignedString(config.TokenPrivateKey)
	return tokenString, err
}
