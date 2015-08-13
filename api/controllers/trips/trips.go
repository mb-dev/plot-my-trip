package trips

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/mb-dev/plot-my-trip/api/lib/auth"
	"github.com/mb-dev/plot-my-trip/api/lib/context"
)

func getAllTripsHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params, context context.Context) {
	w.Write([]byte("[]"))
}

func RegisterRoutes(router *httprouter.Router) {
	router.GET("/api/trips", auth.RequireBearerMiddleware(getAllTripsHandler))
}
