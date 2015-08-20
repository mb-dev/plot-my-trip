import {EventEmitter} from 'events'

import dispatcher from '../dispatcher/dispatcher'
import ActionType from './action_types'
import apiClient from '../libraries/api_client/api_client'
import Trip from './trip'

var CHANGE_EVENT = 'change';

class TripsStore extends EventEmitter{
  constructor() {
    super();
    this.currentTrip = new Trip();
    this.saveSuccessfully = true;
  }
  emitChange() {
    this.emit(CHANGE_EVENT);
  }
  load() {
    apiClient.getTrips((data) => {
      this.currentTrip.data = data[0];
      this.emitChange();
    });
  }
  save() {
    this.saveSuccessfully = false;
    apiClient.updateTrips(this.currentTrip.data, (data) => {
      this.saveSuccessfully = true;
      this.emitChange();
    }, (err) => {
      console.log('save failed', err);
    });
  }
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
  handleDispatch(payload) {
    switch (payload.actionType) {
      case ActionType.LOCATIONS.PLACE_CHANGED:
        this.currentTrip.setActivePlace(payload.googleData);
        this.emitChange();
        break;
      case ActionType.LOCATIONS.ADD_LOCATION:
        this.currentTrip.addActivePlaceToTrip();
        this.emitChange();
        break;
      case ActionType.LOCATIONS.DELETE_LOCATION:
        this.currentTrip.deleteLocation(payload.locationId);
        this.emitChange();
        break;
      case ActionType.GROUPS.ADD_GROUP:
        this.currentTrip.addGroup(payload.groupName);
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
    }
  }
}

var store = new TripsStore();
dispatcher.register(store.handleDispatch.bind(store));

export default store;
