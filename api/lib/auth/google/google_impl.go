package google

import (
	"errors"
	"log"

	"golang.org/x/oauth2"
	"google.golang.org/api/plus/v1"
)

func GetAuthUrlImpl() (string, error) {
	if googleOauthConfig == nil {
		return "", errors.New("google auth not intialized")
	}
	url := googleOauthConfig.AuthCodeURL("state")
	return url, nil
}

func GetUserFromCodeImpl(state string, code string) (GoogleUser, error) {
	user := GoogleUser{}

	if googleOauthConfig == nil {
		return user, errors.New("google auth not intialized")
	}

	token, err := googleOauthConfig.Exchange(oauth2.NoContext, code)
	if err != nil {
		log.Println(err)
		return user, err
	}

	client := googleOauthConfig.Client(oauth2.NoContext, token)

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
