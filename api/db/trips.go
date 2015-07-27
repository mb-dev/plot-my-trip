package db;

func GetAllTrips(userId mgo.ObjectId) {
	mgo.Trips.FindById(userId)
}

func GetTripById(tripId mgo.ObjectId) {

}

func CreateTrip()
