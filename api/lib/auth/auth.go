package auth

import (
	"log"

	"github.com/dgrijalva/jwt-go"
	"github.com/mb-dev/plot-my-trip/api/config"
	"github.com/mb-dev/plot-my-trip/api/db"
	"github.com/mb-dev/plot-my-trip/api/lib/auth/google"
	"golang.org/x/oauth2"
)

func Initialize() {
	google.Initialize()
}

// GetAuthURL returns URL to authenticate with Google
func GetAuthURL() string {
	url := google.GoogleOauthConfig.AuthCodeURL("state", oauth2.AccessTypeOffline, oauth2.ApprovalForce)
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
	tokenString, err = token.SignedString([]byte(config.Config.TokenPrivateKey))
	if err != nil {
		log.Println(err)
		return tokenString, err
	}

	return tokenString, nil
}
