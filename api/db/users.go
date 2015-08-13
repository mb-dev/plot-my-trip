package db

import (
	"github.com/mb-dev/plot-my-trip/api/config"
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

func FindUserById(id string) (User, error) {
	user := User{}
	usersCollection := Db.Session.DB(config.Config.DatabaseName).C("users")
	err := usersCollection.FindId(id).One(&user)
	return user, err
}

func FindUserByEmail(email string) (User, error) {
	user := User{}
	usersCollection := Db.Session.DB(config.Config.DatabaseName).C("users")
	err := usersCollection.Find(bson.M{"email": email}).One(&user)
	return user, err
}

func InsertUser(user User) error {
	usersCollection := Db.Session.DB(config.Config.DatabaseName).C("users")
	return usersCollection.Insert(user)
}

func UpdateUser(user User) error {
	usersCollection := Db.Session.DB(config.Config.DatabaseName).C("users")
	return usersCollection.Update(bson.M{"_id": user.Id}, user)
}

func FindAndUpdateOrCreateUser(userDetails google.GoogleUser) (User, error) {
	user, err := FindUserByEmail(userDetails.Email)
	if err == nil {
		// user is found
		user.AccessToken = userDetails.AccessToken
		user.RefreshToken = userDetails.RefreshToken
		if err := UpdateUser(user); err != nil {
			return user, err
		}
	} else {
		// user not found
		user.Id = bson.NewObjectId()
		user.Name = userDetails.Name
		user.Email = userDetails.Email
		user.AccessToken = userDetails.AccessToken
		user.RefreshToken = userDetails.RefreshToken
		if err := InsertUser(user); err != nil {
			return user, err
		}
	}
	return user, nil
}
