package db

import (
	"encoding/json"

	"github.com/go-errors/errors"
	"github.com/mb-dev/plot-my-trip/api/config"
	"github.com/mb-dev/plot-my-trip/api/lib/bson_helper"
	"gopkg.in/mgo.v2/bson"
)

const collectionName = "trips"

// Trip represents a single trip
type Trip struct {
	ID     bson.ObjectId `bson:"_id,omitempty"`    // ID of the trip
	UserID bson.ObjectId `bson:"userId,omitempty"` // UserId of the trip owner
	Data   bson.M        `bson:",inline"`          // extra Data about the trip
}

// TripCollectionToJSON passes every object through bson before converting to json. To serialize inline properly.
// TODO: replace inline with something else
func TripCollectionToJSON(in []Trip) ([]byte, error) {
	var jsonResult = make([]bson.M, len(in))
	for i := range in {
		jsonResult[i], _ = bsonHelper.BSONToJSON(in[i])
	}
	return json.Marshal(jsonResult)
}

// GetAllTrips returns all trips by the user
func GetAllTrips(userID string) (results []Trip, err *errors.Error) {
	tripsCollection := Db.Session.DB(config.Config.DatabaseName).C(collectionName)
	if err := tripsCollection.Find(bson.M{"userId": bson.ObjectIdHex(userID)}).Limit(5).All(&results); err != nil {
		return results, errors.Wrap(err, 0)
	}
	return results, nil
}

// GetTripByID returns a single trip by id
func GetTripByID(userID string) {

}

// InsertTrip adds a trip
func InsertTrip(trip *Trip) error {
	tripsCollection := Db.Session.DB(config.Config.DatabaseName).C(collectionName)
	if !trip.ID.Valid() {
		trip.ID = bson.NewObjectId()
	}
	if err := tripsCollection.Insert(trip); err != nil {
		return errors.Wrap(err, 0)
	}
	return nil
}

// UpdateTrip updates the trip
func UpdateTrip(trip *Trip) error {
	tripsCollection := Db.Session.DB(config.Config.DatabaseName).C(collectionName)
	if err := tripsCollection.Update(bson.M{"_id": trip.ID}, trip); err != nil {
		return errors.Wrap(err, 0)
	}
	return nil
}
