package testHelpers

import (
	"github.com/mb-dev/plot-my-trip/api/config"
	"github.com/mb-dev/plot-my-trip/api/db"
)

type database struct{}

var Database = new(database)

func (d *database) Connect() error {
	config.Config.DatabaseName = "plot-my-trip-test"
	if err := db.Connect("localhost"); err != nil {
		return err
	}
	return db.Db.Session.DB(config.Config.DatabaseName).DropDatabase()
}

func (d *database) Disconnect() {
	db.Disconnect()
}
