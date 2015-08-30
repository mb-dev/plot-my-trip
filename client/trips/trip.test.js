import Trip from './trip'
import {expect} from 'chai'

let sydneyOpera = {"types":["point_of_interest","establishment"],"place_id":"ChIJ3S-JXmauEmsRUcIaWtf4MzE","name":"Sydney Opera House","position":{"lat":-33.856898,"lng":151.215281},"country":"Australia","city":"Sydney"};
let sydney = {"types":["locality","political"],"place_id":"ChIJP5iLHkCuEmsRwMwyFmh9AQU","name":"Sydney","position":{"lat":-33.8674769,"lng":151.20697759999996},"country":"Australia","city":""};
let pocketBar = {"types":["bar","restaurant","food","point_of_interest","establishment"],"place_id":"ChIJDfUUJReuEmsRyEBsNGE8rRE","name":"Pocket Bar","position":{"lat":-33.878519,"lng":151.215242},"country":"Australia","city":"Sydney"};
let tetsuyaRestaurant = {"types":["restaurant","food","point_of_interest","establishment"],"place_id":"ChIJxXSgfDyuEmsR3X5VXGjBkFg","name":"Tetsuya's Restaurant","position":{"lat":-33.875154,"lng":151.204976},"country":"Australia","city":"Sydney"};

let trip = new Trip();

var addRegion = function(trip, location) {
  trip.setActivePlace(location);
  return trip.addActivePlaceAsRegion();
}

var addLocationToTrip = function(trip, region, place) {
  trip.setActivePlace(place);
  let location = trip.addActivePlaceToTrip();
  trip.addLocationToRegion(region.id, location.id);
  return location;
}

describe('Trip', function() {
  beforeEach(function() {
    trip.reset();
  });
  describe('location', function() {
    beforeEach(function() {
      this.region = addRegion(trip, sydney);
      expect(this.region).to.exist
    });
    describe('addActivePlaceToTrip', function() {
      it('should be able to add a location', function() {
        addLocationToTrip(trip, this.region, sydneyOpera);
        let locations = trip.getLocations();
        expect(locations.length).to.equal(1);
      });
    });
    describe('deleteLocation', function() {
      it('should be able to remove location from group', function() {
        let group = trip.addGroup(this.region.id, 'Sydney Day 1');
        let location = addLocationToTrip(trip, this.region, sydneyOpera);
        trip.addLocationToGroup(group.id, location.id);
        let location2 = addLocationToTrip(trip, this.region, pocketBar);
        trip.addLocationToGroup(group.id, location2.id);
        trip.deleteLocation(location.id);
        let locations = trip.getLocations();
        expect(locations.length).to.equal(1);
        expect(group.locations).to.deep.equal([location2.id]);
        expect(this.region.scrapeLocations).to.deep.equal([]);
      });
      it('should be able to remove location from region', function() {
        let location = addLocationToTrip(trip, this.region, sydneyOpera);
        let location2 = addLocationToTrip(trip, this.region, pocketBar);
        trip.deleteLocation(location.id);
        let locations = trip.getLocations();
        expect(locations.length).to.equal(1);
        expect(this.region.scrapeLocations).to.deep.equal([location2.id]);
      });
    });
  });
  describe('groups', function() {
    beforeEach(function() {
      trip.setActivePlace(sydney);
      this.region = trip.addActivePlaceAsRegion();
      trip.setActivePlace(sydneyOpera);
      this.location = trip.addActivePlaceToTrip();
      trip.addLocationToRegion(this.region.id, this.location.id);
    });
    describe('addLocationToGroup', function() {
      it('should add the location to the group and remove it from scrap locations', function() {
        let group = trip.addGroup(this.region.id, 'Sydney Day 1');
        trip.addLocationToGroup(group.id, this.location.id);
        this.location = trip.getLocationById(this.location.id);
        expect(this.location.groupId).to.equal(group.id);
        expect(this.region.scrapeLocations.length).to.equal(0);
      });
      it('adding location to a group twice should not add multiple times', function() {
        let group = trip.addGroup(this.region.id, 'Sydney Day 1');
        trip.addLocationToGroup(group.id, this.location.id);
        trip.addLocationToGroup(group.id, this.location.id);
        expect(group.locations).to.deep.equal([this.location.id])
      });
      it('adding location to two groups should keep last', function() {
        let group1 = trip.addGroup(this.region.id, 'Sydney Day 1');
        let group2 = trip.addGroup(this.region.id, 'Sydney Day 2');
        trip.addLocationToGroup(group1.id, this.location.id);
        trip.addLocationToGroup(group2.id, this.location.id);
        expect(group1.locations).to.deep.equal([]);
        expect(group2.locations).to.deep.equal([this.location.id]);
        // not sure why this needs to be called. TODO: investigate
        this.location = trip.getLocationById(this.location.id);
        expect(this.location.groupId).to.equal(group2.id);
      });
    });
    describe('addLocationToGroup', function() {
      it('should be able to move a location up in a group', function() {
        trip.setActivePlace(pocketBar);
        let location1 = this.location;
        let location2 = trip.addActivePlaceToTrip();
        let group = trip.addGroup(this.region.id, 'Sydney Day 1');
        trip.addLocationToGroup(group.id, location1.id);
        trip.addLocationToGroup(group.id, location2.id);
        expect(group.locations).to.deep.equal([location1.id, location2.id]);
        trip.moveLocationUp(group.id, location2.id);
        expect(group.locations).to.deep.equal([location2.id, location1.id]);
      });
    });
    describe('addLocationToGroup', function() {
      it('should be able to move a location down in a group', function() {
        trip.setActivePlace(pocketBar);
        let location1 = this.location;
        let location2 = trip.addActivePlaceToTrip();
        let group = trip.addGroup(this.region.id, 'Sydney Day 1');
        trip.addLocationToGroup(group.id, location1.id);
        trip.addLocationToGroup(group.id, location2.id);
        expect(group.locations).to.deep.equal([location1.id, location2.id]);
        trip.moveLocationDown(group.id, location1.id);
        expect(group.locations).to.deep.equal([location2.id, location1.id]);
      });
    });
  });
  describe('regions', function() {
    beforeEach(function() {
      trip.setActivePlace(sydneyOpera);
      this.location = trip.addActivePlaceToTrip();
    });
    describe('addActivePlaceAsRegion', function() {
      it('should add the region to the trip', function() {
        trip.setActivePlace(sydney);
        let region = trip.addActivePlaceAsRegion();
        expect(trip.getRegions()[0].id).to.deep.equal(region.id);
      });
    });
    describe('getRegionScrapLocations', function() {
      it('should return scrape locations', function() {
        trip.setActivePlace(sydney);
        let region = trip.addActivePlaceAsRegion();
        trip.addLocationToRegion(region.id, this.location.id);
        let locations = trip.getRegionScrapLocations(region.id);
        expect(locations[0].id).to.equal(this.location.id);
      });
    });
    describe('getLocationsInRegion', function() {
      it('should return assigned and scrape locations', function() {
        trip.setActivePlace(sydney);
        let region = trip.addActivePlaceAsRegion();
        trip.addLocationToRegion(region.id, this.location.id);
        let group = trip.addGroup(region.id, 'Day 1');
        trip.setActivePlace(pocketBar);
        let location2 = trip.addActivePlaceToTrip();
        trip.addLocationToGroup(group.id, location2.id);
        let locations = trip.getLocationsInRegion(region.id);
        expect(locations.length).to.equal(2);
        expect(locations[0].id).to.equal(this.location.id);
        expect(locations[1].id).to.equal(location2.id);
      });
    });
  });
});
