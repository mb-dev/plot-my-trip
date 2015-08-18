import _ from 'lodash'
import {EventEmitter} from 'events'

import dispatcher from '../dispatcher/dispatcher'
import ActionType from './action_types'
import storage from '../libraries/storage/storage'

var CHANGE_EVENT = 'change';

class Trip {
  constructor() {
    this.reset();
  }
  getNextId() {
    let current = this.data.nextId;
    this.data.nextId += 1;
    return current;
  }
  reset() {
    this.data = {groups: [], locations: [], nextId: 1};
    this.activePlace = null;
    this.activeGroup = null;
  }
  setActivePlace(place) {
    this.activePlace = place;
  }
  setActiveGroup(group) {
    this.activeGroup = group;
  }
  addActivePlaceToTrip() {
    if (!this.activePlace) {
      return;
    }
    let location = {
      id: this.getNextId(),
      name: this.activePlace.name,
      type: this.activePlace.types[0],
      googleData: this.activePlace
    };
    this.data.locations.push(location);
    return location;
  }
  getLocationById(locationId) {
    return _.find(this.data.locations, {id: locationId});
  }
  getLocations() {
    return this.data.locations;
  }

  getGroups() {
    return this.data.groups;
  }
  getGroupById(groupId) {
    return _.find(this.data.groups, {id: groupId});
  }
  addGroup(groupName) {
    let group = {
      id: this.getNextId(),
      name: groupName,
      locations: []
    };
    this.data.groups.push(group);
    return group;
  }
  removeGroup(groupId) {
    _.remove(this.data.groups, (group) => group.id === groupId)
  }
  getGroupMembers(groupId) {
    return _.filter(this.data.locations, (location) => location.groupId === groupId );
  }
  addLocationToGroup(groupId, locationId) {
    let location = this.getLocationById(locationId);
    let group = this.getGroupById(groupId);
    location.groupId = groupId;
    group.locations.push(locationId);
  }
  removeLocationFromGroup() {

  }
  moveLocationUp(groupId, locationId) {
    let group = this.getGroupById(groupId);
    let currentIndex = group.locations.indexOf(locationId);
    if (currentIndex < 0) {
      return null;
    }
    group.locations.splice(currentIndex, 1);
    group.locations.splice(currentIndex-1, 0, locationId);
  }
  moveLocationDown(groupId, locationId) {
    let group = this.getGroupById(groupId);
    let currentIndex = group.locations.indexOf(locationId);
    if (currentIndex < 0) {
      return null;
    }
    group.locations.splice(currentIndex, 1);
    group.locations.splice(currentIndex+1, 0, locationId);
  }
}

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
    let bearerToken = storage.getBearerToken();
    if (!bearerToken) {
      return;
    }
    $.ajax({
      url: '/api/trips',
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + bearerToken);
      },
      success: (data) => {
        this.currentTrip.data = data;
        this.emitChange();
      }
    });
  }
  save() {
    this.saveSuccessfully = false;
    let bearerToken = storage.getBearerToken();
    if (!bearerToken) {
      return;
    }
    $.ajax({
      url: '/api/trips/update-trip',
      data: JSON.stringify(this.currentTrip.data),
      dataType: "json",
      contentType: "application/json",
      method: 'post',
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + bearerToken);
      },
      success: (data) => {
        this.saveSuccessfully = true;
        this.emitChange();
      },
      failure: (err) => {
        console.log('save failed', err);
      }
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
      case ActionType.PLACE_CHANGED:
        this.currentTrip.setActivePlace(payload.googleData);
        break;
      case ActionType.ADD_LOCATION:
        this.currentTrip.addActivePlaceToTrip();
        this.emitChange();
        break;
      case ActionType.ADD_GROUP:
        this.currentTrip.addGroup(payload.groupName);
        this.emitChange();
        break;
    }
  }
}

var store = new TripsStore();
dispatcher.register(store.handleDispatch.bind(store));

export default store;
