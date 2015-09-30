import {EventEmitter} from 'events'

import dispatcher from '../dispatcher/dispatcher'
import ActionType from './action_types'
import apiClient from '../libraries/api_client/api_client'
import Trip from './trip'

var CHANGE_EVENT = 'change';

class TripsStore extends EventEmitter{
  constructor() {
    super();
    this.currentTrip = null;
    this.trips = [];
    this.tripById = {};
    this.activeTripId = null;
    this.activeRegionName = null;
    this.saveSuccessfully = true;
  }
  emitChange() {
    this.emit(CHANGE_EVENT);
  }
  load() {
    apiClient.getTrips((data) => {
      if(data.length > 0) {
        data.forEach((tripData) => {
          let trip = new Trip(tripData);
          let tripId = trip.getTripId();
          this.addTrip(trip);
          trip.assignColorByGroup();
        });
        this.applyState();
        this.emitChange();
      }
    });
  }
  save(success) {
    this.saveSuccessfully = false;
    apiClient.updateTrips(this.currentTrip.data, (data) => {
      this.saveSuccessfully = true;
      if(this.currentTrip.data._id === null && data.tripId) {
        let tripId = this.currentTrip.data._id = data.tripId;
        delete this.tripById['new'];
        this.tripById[tripId] = this.currentTrip;
        this.activeTripId = tripId;
      }
      if (success) {
        success();
      }
      this.emitChange();
    }, (err) => {
      console.log('save failed', err);
    });
  }
  getTripsSummary() {
    return this.trips.map(function(trip) {
      return {
        id: trip.getTripId(),
        name: trip.getTripName(),
        regionsCount: trip.getRegionCount()
      };
    });
  }
  getTripById(id) {
    if (!id) {
      return null;
    }
    return this.tripById[id];
  }
  addTrip(trip) {
    let tripId = trip.getTripId();
    this.tripById[tripId] = trip;
    this.trips.push(trip);
  }
  applyState() {
    if (this.activeTripId) {
      this.currentTrip = this.tripById[this.activeTripId];
    }
    if (this.currentTrip.data.regions.length > 0) {
      if (this.activeRegionName) {
        this.currentTrip.setActiveRegion(this.currentTrip.getRegionByName(this.activeRegionName));
      } else {
        this.currentTrip.setActiveRegion(this.currentTrip.data.regions[0]);
      }
    }
  }
  setActiveTrip(id, regionName) {
    this.activeTripId = id;
    this.activeRegionName = regionName;
    this.currentTrip = this.getTripById(id);
    if (this.currentTrip) {
      this.applyState();
      this.emitChange();
    }
  }
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
  handleDispatch(payload) {
    switch (payload.actionType) {
      case ActionType.TRIPS.CREATE_TRIP:
        let trip = new Trip();
        trip.setTripName('Trip to ' + payload.initialPlace.name)
        trip.setActivePlace(payload.initialPlace);
        let region2 = trip.addActivePlaceAsRegion();
        trip.setActiveRegion(region2);
        trip.addGroup(region2.id, 'Day 1');
        trip.addGroup(region2.id, 'Day 2');
        trip.assignColorByGroup();
        this.addTrip(trip);
        this.setActiveTrip(trip.getTripId());
        this.emitChange();
        break;
      case ActionType.LOCATIONS.PLACE_CHANGED:
        this.currentTrip.setActivePlace(payload.googleData);
        this.emitChange();
        break;
      case ActionType.LOCATIONS.FOCUS_LOCATION:
        this.currentTrip.setFocusLocation(payload.locationId);
        this.emitChange();
        break;
      case ActionType.LOCATIONS.ADD_LOCATION:
        let location = this.currentTrip.addActivePlaceToTrip();
        if (payload.regionId) {
          this.currentTrip.addLocationToRegion(payload.regionId, location.id);
        }
        this.emitChange();
        break;
      case ActionType.LOCATIONS.EDIT_LOCATION:
        this.currentTrip.editLocation(payload.locationId, payload.newData);
        this.emitChange();
        break;
      case ActionType.LOCATIONS.DELETE_LOCATION:
        this.currentTrip.deleteLocation(payload.locationId);
        this.emitChange();
        break;
      case ActionType.LOCATIONS.MOVE_LOCATION_UP:
        this.currentTrip.moveLocationUp(payload.locationId);
        this.emitChange();
        break;
      case ActionType.LOCATIONS.MOVE_LOCATION_DOWN:
        this.currentTrip.moveLocationDown(payload.locationId);
        this.emitChange();
        break;
      case ActionType.GROUPS.ADD_GROUP:
        let amountOfGroups = this.currentTrip.getGroupsInRegion(payload.regionId).length;
        this.currentTrip.addGroup(payload.regionId, 'Day ' + (amountOfGroups + 1));
        this.currentTrip.assignColorByGroup();
        this.emitChange();
        break;
      case ActionType.GROUPS.DELETE_GROUP:
        this.currentTrip.addGroup(payload.groupId);
        this.emitChange();
        break;
      case ActionType.GROUPS.ADD_PLACE_TO_GROUP:
        this.currentTrip.addLocationToGroup(payload.groupId, payload.locationId);
        this.emitChange();
        break;
      case ActionType.GROUPS.SELECT_GROUP:
        this.currentTrip.selectGroup(payload.groupId);
        this.emitChange();
        break;
      case ActionType.REGIONS.SELECT_REGION:
        this.currentTrip.setActiveRegion(payload.regionId);
        this.emitChange();
        break;
      case ActionType.REGIONS.ADD_REGION:
        let region = this.currentTrip.addActivePlaceAsRegion();
        this.currentTrip.setActiveRegion(region);
        this.emitChange();
        break;
      case ActionType.REGIONS.DELETE_REGION:
        this.currentTrip.deleteRegion();
        this.emitChange();
        break;
    }
  }
}

var store = new TripsStore();
dispatcher.register(store.handleDispatch.bind(store));

export default store;
