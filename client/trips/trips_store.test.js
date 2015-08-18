import tripsStore from './trips_store'
import {expect} from 'chai'

let sydneyOpera = {"types":["point_of_interest","establishment"],"place_id":"ChIJ3S-JXmauEmsRUcIaWtf4MzE","name":"Sydney Opera House","location":{"lat":-33.856898,"lng":151.215281},"country":"Australia","city":"Sydney"};
let sydney = {"types":["locality","political"],"place_id":"ChIJP5iLHkCuEmsRwMwyFmh9AQU","name":"Sydney","location":{"lat":-33.8674769,"lng":151.20697759999996},"country":"Australia","city":""};
let pocketBar = {"types":["bar","restaurant","food","point_of_interest","establishment"],"place_id":"ChIJDfUUJReuEmsRyEBsNGE8rRE","name":"Pocket Bar","location":{"lat":-33.878519,"lng":151.215242},"country":"Australia","city":"Sydney"};
let tetsuyaRestaurant = {"types":["restaurant","food","point_of_interest","establishment"],"place_id":"ChIJxXSgfDyuEmsR3X5VXGjBkFg","name":"Tetsuya's Restaurant","location":{"lat":-33.875154,"lng":151.204976},"country":"Australia","city":"Sydney"};

let trip = tripsStore.currentTrip;

describe('TripsStore', function() {
  beforeEach(function() {
    trip.reset();
  });
  describe('location', function() {
    it('should be able to add a location', function() {
      trip.setActivePlace(sydneyOpera);
      trip.addActivePlaceToTrip();
      let locations = trip.getLocations();
      expect(locations.length).to.equal(1);
      expect(locations[0].id).to.equal(1);
    });
  });
  describe('groups', function() {
    beforeEach(function() {
      trip.setActivePlace(sydneyOpera);
      this.location = trip.addActivePlaceToTrip();
    });
    it('should be able to add the location to a group', function() {
      let group = trip.addGroup('Sydney Day 1');
      expect(group.id).to.equal(2);
      trip.addLocationToGroup(group.id, this.location.id);
      this.location = trip.getLocationById(this.location.id);
      expect(this.location.groupId).to.equal(group.id);
    });
    it('should be able to move a location up in a group', function() {
      trip.setActivePlace(pocketBar);
      let location1 = this.location;
      let location2 = trip.addActivePlaceToTrip();
      let group = trip.addGroup('Sydney Day 1');
      trip.addLocationToGroup(group.id, location1.id);
      trip.addLocationToGroup(group.id, location2.id);
      expect(group.locations).to.deep.equal([location1.id, location2.id]);
      trip.moveLocationUp(group.id, location2.id);
      expect(group.locations).to.deep.equal([location2.id, location1.id]);
    });
    it('should be able to move a location down in a group', function() {
      trip.setActivePlace(pocketBar);
      let location1 = this.location;
      let location2 = trip.addActivePlaceToTrip();
      let group = trip.addGroup('Sydney Day 1');
      trip.addLocationToGroup(group.id, location1.id);
      trip.addLocationToGroup(group.id, location2.id);
      expect(group.locations).to.deep.equal([location1.id, location2.id]);
      trip.moveLocationDown(group.id, location1.id);
      expect(group.locations).to.deep.equal([location2.id, location1.id]);
    });
  });
});
