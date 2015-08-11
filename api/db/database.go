package db

import (
	"log"

	"gopkg.in/mgo.v2"
)

type database struct {
	Session *mgo.Session
}

var (
	Db database
)

func Connect(url string) error {
	session, err := mgo.Dial(url)
	if err != nil {
		log.Printf("Error while connecting to the database: %s", err.Error())
		return err
	}
	log.Println("Connected to the database... ")
	Db.Session = session
	return nil
}

func Disconnect() {
	if Db.Session != nil {
		Db.Session.Close()
	}
	log.Println("Disconnected from the database...")
}
