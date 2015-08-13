package api

import (
	"github.com/julienschmidt/httprouter"
	"github.com/mb-dev/plot-my-trip/api/controllers/auth"
	"github.com/mb-dev/plot-my-trip/api/controllers/trips"
	"github.com/mb-dev/plot-my-trip/api/db"
)

func registerRoutes(router *httprouter.Router) {
	auth.RegisterRoutes(router)
	trips.RegisterRoutes(router)
}

func Initialize(router *httprouter.Router) error {
	if err := db.Connect("127.0.0.1"); err != nil {
		return err
	}
	registerRoutes(router)
	return nil
}

func Destroy() {
	db.Disconnect()
}
