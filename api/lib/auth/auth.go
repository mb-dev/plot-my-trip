package auth

import (
	"fmt"
	"log"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/julienschmidt/httprouter"
	"github.com/mb-dev/plot-my-trip/api/config"
	"github.com/mb-dev/plot-my-trip/api/db"
	"github.com/mb-dev/plot-my-trip/api/lib/auth/google"
	"github.com/mb-dev/plot-my-trip/api/lib/context"
)

// Initialize initializes the authentication options (right now only Google is supported)
func Initialize() {
	google.Initialize()
}

// GetAuthURL returns URL to authenticate with Google
func GetAuthURL() (string, error) {
	return google.GetAuthUrl()
}

// TokenizeHandler handles the callback code and will create a user
func TokenizeHandler(state string, code string) (string, error) {
	tokenString := ""

	log.Println("1")
	userDetails, err := google.GetUserFromCode(state, code)
	if err != nil {
		log.Println(err)
		return tokenString, err
	}
	log.Println("2")

	user, err := db.FindAndUpdateOrCreateUser(userDetails)
	if err != nil {
		log.Println(err)
		return tokenString, err
	}

	log.Println("3")

	token := jwt.New(jwt.SigningMethodHS256)
	token.Claims["user"] = user.ID
	token.Claims["email"] = user.Email
	tokenString, err = token.SignedString([]byte(config.Config.TokenPrivateKey))
	if err != nil {
		log.Println(err)
		return tokenString, err
	}

	return tokenString, nil
}

// RequireBearerMiddleware ensures that the Bearer token is valid and assigns the user to the current context
func RequireBearerMiddleware(handle context.HandlerWithContext) httprouter.Handle {
	innerFunc := func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		token, err := jwt.ParseFromRequest(r, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				http.Error(w, fmt.Sprintf("Unexpected signing method: %v", token.Header["alg"]), http.StatusUnauthorized)
			}
			return []byte(config.Config.TokenPrivateKey), nil
		})
		if err != nil || !token.Valid {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}
		userID, ok := token.Claims["user"].(string)
		if !ok {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}
		user, err := db.FindUserByID(userID)
		if err != nil {
			http.Error(w, "User with id: "+userID+" "+err.Error(), http.StatusUnauthorized)
			return
		}
		handle(w, r, ps, context.CreateContext(user))
	}
	return innerFunc
}
