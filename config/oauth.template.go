package config

const (
	OauthURL                = HostURL + APIURL + "/auth"
	OauthGoogleClientID     = "clientid"
	OauthGoogleClientSecret = "secret"
	OauthGoogleRedirectURL  = OauthURL + "/google/redirect"
)
