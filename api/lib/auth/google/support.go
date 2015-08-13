package google

import (
	"net/url"

	"golang.org/x/oauth2"
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
