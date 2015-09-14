package trips

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/go-errors/errors"
	"github.com/julienschmidt/httprouter"
	"github.com/mb-dev/plot-my-trip/api/db"
	"github.com/mb-dev/plot-my-trip/api/lib/auth"
	"github.com/mb-dev/plot-my-trip/api/lib/bson_helper"
	"github.com/mb-dev/plot-my-trip/api/lib/context"
)

func getAllTripsHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params, context context.Context) {
	trips, err := db.GetAllTrips(context.User.ID.Hex())
	if err != nil {
		http.Error(w, err.ErrorStack(), http.StatusInternalServerError)
		return
	}
	responseJSON, rawErr := db.TripCollectionToJSON(trips)
	if err != nil {
		http.Error(w, errors.Wrap(rawErr, 0).ErrorStack(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}

type updateTripResponse struct {
	TripID string `json:"tripId"`
}

func updateTripHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params, context context.Context) {
	body, rawErr := ioutil.ReadAll(r.Body)
	if rawErr != nil {
		http.Error(w, errors.Wrap(rawErr, 0).ErrorStack(), http.StatusInternalServerError)
		return
	}
	trip := db.Trip{}
	if err := bsonHelper.JSONToBSONStruct(body, &trip); err != nil {
		http.Error(w, errors.Wrap(err, 0).ErrorStack(), http.StatusInternalServerError)
	}
	trip.UserID = context.User.ID
	if trip.ID.Valid() {
		if err := db.UpdateTrip(&trip); err != nil {
			http.Error(w, errors.Wrap(err, 0).ErrorStack(), http.StatusInternalServerError)
			return
		}
	} else {
		if err := db.InsertTrip(&trip); err != nil {
			http.Error(w, errors.Wrap(err, 0).ErrorStack(), http.StatusInternalServerError)
			return
		}
	}
	js, err := json.Marshal(&updateTripResponse{TripID: trip.ID.Hex()})
	if err != nil {
		http.Error(w, errors.Wrap(err, 0).ErrorStack(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

// RegisterRoutes adds trip routers to the router
func RegisterRoutes(router *httprouter.Router) {
	router.GET("/api/trips", auth.RequireBearerMiddleware(getAllTripsHandler))
	router.POST("/api/trips/update-trip", auth.RequireBearerMiddleware(updateTripHandler))
}
