package api

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/julienschmidt/httprouter"
	"github.com/mb-dev/plot-my-trip/api/controllers/auth"
	"github.com/mb-dev/plot-my-trip/api/db"
	"github.com/mb-dev/plot-my-trip/api/lib/auth/google"
	"github.com/mb-dev/plot-my-trip/api/lib/test_helpers"
	"github.com/stretchr/testify/assert"
)

func TestAuthGoogleHandler(t *testing.T) {
	router := httprouter.New()
	auth.RegisterRoutes(router)

	req, err := http.NewRequest("GET", "/api/auth/google", nil)
	if err != nil {
		t.Fatal(err)
	}
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected call to succeed. Got error: %s", w.Body.String())
	}

	assert.Equal(t, "http://redirect.url", w.Body.String())
}

func TestTokenizeHandler(t *testing.T) {
	router := httprouter.New()
	auth.RegisterRoutes(router)

	err := testHelpers.Database.Connect()
	if err != nil {
		t.Fatal(err)
	}
	defer testHelpers.Database.Disconnect()

	var jsonRequestBody = []byte(`{"state":"state","code":"1234"}`)
	req, err := http.NewRequest("POST", "/api/auth/tokenize", bytes.NewBuffer(jsonRequestBody))
	if err != nil {
		t.Fatal(err)
	}
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected call to succeed. Got error: %s", w.Body.String())
	}

	user, err := db.FindUserByEmail(google.FakeEmail)
	if err != nil {
		t.Fatal(err)
	}
	assert.Equal(t, google.FakeEmail, user.Email)
}
