package google

import (
	"log"
	"net/url"

	"github.com/mb-dev/plot-my-trip/api/config"
	"golang.org/x/oauth2"
	"google.golang.org/api/plus/v1"
)

const (
	ProviderID = 1
	Scheme     = "https"
	Host       = "www.googleapis.com"
	Opaque     = "//www.googleapis.com/plus/v1/people/me"
	AuthURL    = "https://accounts.google.com/o/oauth2/auth"
	TokenURL   = "https://accounts.google.com/o/oauth2/token"
)

type GoogleUser struct {
	Name         string
	Email        string
	AccessToken  string
	RefreshToken string
}

var RequestURL = &url.URL{
	Scheme: Scheme,
	Host:   Host,
	Opaque: Opaque,
}

var Endpoint = oauth2.Endpoint{
	AuthURL:  AuthURL,
	TokenURL: TokenURL,
}

var GoogleOauthConfig *oauth2.Config

func Initialize() {
	GoogleOauthConfig = getConfiguration()
}

func getConfiguration() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     config.Config.OauthGoogleClientID,
		ClientSecret: config.Config.OauthGoogleClientSecret,
		RedirectURL:  config.Config.OauthGoogleRedirectURL,
		Scopes: []string{
			"email",
			"profile",
			"https://www.googleapis.com/auth/plus.login",
			"https://www.googleapis.com/auth/calendar.readonly",
		},
		Endpoint: Endpoint,
	}
}

func GetUserFromCode(state string, code string) (GoogleUser, error) {
	user := GoogleUser{}

	token, err := GoogleOauthConfig.Exchange(oauth2.NoContext, code)
	if err != nil {
		log.Println(err)
		return user, err
	}

	client := GoogleOauthConfig.Client(oauth2.NoContext, token)

	svc, err := plus.New(client)
	if err != nil {
		log.Println(err)
		return user, err
	}

	person, err := svc.People.Get("me").Do()
	if err != nil {
		log.Println(err)
		return user, err
	}

	user = GoogleUser{
		Name:         person.DisplayName,
		Email:        person.Emails[0].Value,
		AccessToken:  token.AccessToken,
		RefreshToken: token.RefreshToken}

	return user, nil
}
