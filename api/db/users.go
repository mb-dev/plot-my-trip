package db

import (
	"github.com/mb-dev/plot-my-trip/api/lib/auth/google"
	"gopkg.in/mgo.v2/bson"
)

type User struct {
	Id    bson.ObjectId `bson:"_id,omitempty"`
	Name  string        `bson:"name"`
	Email string        `bson:"email"`

	AccessToken  string `bson:"access_token"`
	RefreshToken string `bson:"refresh_token"`
}

func FindAndUpdateOrCreateUser(userDetails google.GoogleUser) (User, error) {
	user := User{}
	usersCollection := Db.Session.DB("plot-my-trip").C("users")

	err := usersCollection.Find(bson.M{"email": userDetails.Email}).One(&user)
	if err == nil {
		// user is found
		user.AccessToken = userDetails.AccessToken
		user.RefreshToken = userDetails.RefreshToken
		if err := usersCollection.Update(bson.M{"_id": user.Id}, user); err != nil {
			return user, err
		}
	} else {
		// user not found
		user.Id = bson.NewObjectId()
		user.Name = userDetails.Name
		user.Email = userDetails.Email
		user.AccessToken = userDetails.AccessToken
		user.RefreshToken = userDetails.RefreshToken
		if err := usersCollection.Insert(user); err != nil {
			return user, err
		}
	}
	return user, nil
}
