package google

import (
	"github.com/mb-dev/plot-my-trip/api/config"
	"golang.org/x/oauth2"
)

var (
	googleOauthConfig *oauth2.Config
	GetAuthUrl        = GetAuthUrlFake
	GetUserFromCode   = GetUserFromCodeFake
)

func Initialize() {
	googleOauthConfig = getConfiguration()
	GetAuthUrl = GetAuthUrlImpl
	GetUserFromCode = GetUserFromCodeImpl
}

func getConfiguration() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     config.Config.OauthGoogleClientID,
		ClientSecret: config.Config.OauthGoogleClientSecret,
		RedirectURL:  config.Config.OauthGoogleRedirectURL,
		Scopes: []string{
			"email",
			"profile",
		},
		Endpoint: Endpoint,
	}
}

type GetAuthURLFunc func() (string, error)
type GetUserFromCodeFunc func(state string, code string) (GoogleUser, error)
