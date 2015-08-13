package context

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/mb-dev/plot-my-trip/api/db"
)

type Context struct {
	User db.User
}

type HandlerWithContext func(w http.ResponseWriter, r *http.Request, ps httprouter.Params, context Context)

func CreateContext(user db.User) Context {
	return Context{User: user}
}
