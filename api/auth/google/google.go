package google

import (
	"fmt"
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

var RequestURL = &url.URL{
	Scheme: Scheme,
	Host:   Host,
	Opaque: Opaque,
}

var Endpoint = oauth2.Endpoint{
	AuthURL:  AuthURL,
	TokenURL: TokenURL,
}

var Config = oauth2Config()

func oauth2Config() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     config.OauthGoogleClientID,
		ClientSecret: config.OauthGoogleClientSecret,
		RedirectURL:  config.OauthGoogleRedirectURL,
		Scopes: []string{
			"email",
			"profile",
			"https://www.googleapis.com/auth/plus.login",
			"https://www.googleapis.com/auth/calendar.readonly",
		},
		Endpoint: Endpoint,
	}
}

func HandleCallback(code string) {
	token, err := Config.Exchange(oauth2.NoContext, code)
	if err != nil {
		log.Fatal(err)
		return
	}
	client := Config.Client(oauth2.NoContext, token)

	svc, err := plus.New(client)
	person, err := svc.People.Get("me").Do()
	fmt.Println(person.Emails[0].Value)
}
