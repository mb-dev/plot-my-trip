package db

import (
	"encoding/json"

	"github.com/go-errors/errors"
	"github.com/mb-dev/plot-my-trip/api/config"
	"gopkg.in/mgo.v2/bson"
)

const collectionName = "trips"

// Trip represents a single trip
type Trip struct {
	ID     bson.ObjectId `bson:"_id,omitempty"`    // ID of the trip
	UserID bson.ObjectId `bson:"userId,omitempty"` // UserId of the trip owner
	Data   bson.M        `bson:",inline"`          // extra Data about the trip
}

func jsonToBsonStruct(body []byte, out interface{}) error {
	var jsonMap map[string]interface{}
	json.Unmarshal(body, &jsonMap)
	b, _ := bson.Marshal(&jsonMap)
	return bson.Unmarshal(b, out)
}

func bsonToJSON(in interface{}) (jsonResult bson.M, err error) {
	b, _ := bson.Marshal(in)
	err = bson.Unmarshal(b, &jsonResult)
	return jsonResult, err
}

// TripCollectionToJSON passes every object through bson before converting to json. To serialize inline properly.
// TODO: replace inline with something else
func TripCollectionToJSON(in []Trip) ([]byte, error) {
	var jsonResult = make([]bson.M, len(in))
	for i := range in {
		jsonResult[i], _ = bsonToJSON(in[i])
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
func InsertTrip(trip Trip) error {
	tripsCollection := Db.Session.DB(config.Config.DatabaseName).C(collectionName)
	return tripsCollection.Insert(trip)
}

// UpdateTrip updates the trip
func UpdateTrip(trip Trip) error {
	tripsCollection := Db.Session.DB(config.Config.DatabaseName).C(collectionName)
	return tripsCollection.Update(bson.M{"_id": trip.ID}, trip)
}

// CreateTripFromBody inserts a trip from document body
func CreateTripFromBody(userID string, tripBody []byte) *errors.Error {
	trip := Trip{}

	if err := jsonToBsonStruct(tripBody, &trip); err != nil {
		return errors.Wrap(err, 0)
	}
	trip.UserID = bson.ObjectIdHex(userID)
	if err := InsertTrip(trip); err != nil {
		return errors.Wrap(err, 0)
	}
	return nil
}

// UpdateTripFromBody updates a trip from document body
func UpdateTripFromBody(userID string, tripBody []byte) *errors.Error {
	trip := Trip{}
	if err := jsonToBsonStruct(tripBody, &trip); err != nil {
		return errors.Wrap(err, 0)
	}
	if err := UpdateTrip(trip); err != nil {
		return errors.Wrap(err, 0)
	}
	return nil
}
