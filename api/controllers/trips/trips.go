package trips

import (
	"io/ioutil"
	"net/http"

	"github.com/go-errors/errors"
	"github.com/julienschmidt/httprouter"
	"github.com/mb-dev/plot-my-trip/api/db"
	"github.com/mb-dev/plot-my-trip/api/lib/auth"
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

func updateTripHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params, context context.Context) {
	trips, err := db.GetAllTrips(context.User.ID.Hex())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	body, rawErr := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, errors.Wrap(rawErr, 0).ErrorStack(), http.StatusInternalServerError)
		return
	}
	if len(trips) == 0 {
		if err := db.CreateTripFromBody(context.User.ID.Hex(), body); err != nil {
			http.Error(w, err.ErrorStack(), http.StatusInternalServerError)
			return
		}
	} else {
		if err := db.UpdateTripFromBody(context.User.ID.Hex(), body); err != nil {
			http.Error(w, err.ErrorStack(), http.StatusInternalServerError)
			return
		}
	}
	w.WriteHeader(http.StatusOK)
}

// RegisterRoutes adds trip routers to the router
func RegisterRoutes(router *httprouter.Router) {
	router.GET("/api/trips", auth.RequireBearerMiddleware(getAllTripsHandler))
	router.POST("/api/trips/update-trip", auth.RequireBearerMiddleware(updateTripHandler))
}
