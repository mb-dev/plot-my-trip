package config

import (
	"crypto/rsa"

	"github.com/kelseyhightower/envconfig"
)

type configuration struct {
	HostURL    string `default:"http://www.plot-my-trip.local.com:8000"`
	HttpUrl    string `default:"http://www.plot-my-trip.local.com:8080"`
	APIRoot    string `default:"/api"`
	APIVersion string `default:"v1"`

	DatabaseName string `default:"plot-my-trip"`

	OauthURL                string
	OauthGoogleClientID     string `envconfig:"google_client_id"`
	OauthGoogleClientSecret string `envconfig:"google_client_secret"`
	OauthGoogleRedirectURL  string
	TokenPrivateKey         string `envconfig:"token_private_key"`
}

var (
	Config  configuration
	SignKey *rsa.PrivateKey
)

func LoadConfiguration() error {
	err := envconfig.Process("PLOT_MY_TRIP", &Config)
	if err != nil {
		return err
	}
	Config.OauthURL = Config.HostURL + Config.APIRoot + "/auth"
	//Config.OauthGoogleRedirectURL = Config.HttpUrl + "/webpack-dev-server/handleCallback.html"
	Config.OauthGoogleRedirectURL = Config.HostURL + "/auth/google/callback"

	return nil
}
