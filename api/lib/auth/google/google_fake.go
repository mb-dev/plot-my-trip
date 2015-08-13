package google

const (
	FakeEmail = "test@test.com"
)

func GetAuthUrlFake() (string, error) {
	return "http://redirect.url", nil
}

func GetUserFromCodeFake(state string, code string) (GoogleUser, error) {
	user := GoogleUser{
		Name:         "Test User",
		Email:        FakeEmail,
		AccessToken:  "accessToken",
		RefreshToken: "refreshToken"}

	return user, nil
}
