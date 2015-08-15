import _ from 'lodash'
import {EventEmitter} from 'events'
import dispatcher from '../dispatcher/dispatcher'
import ActionType from './action_types'

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
      name: groupName
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
    location.groupId = groupId;
  }
  removeLocationFromGroup() {

  }
  movePlaceUp() {

  }
  movePlaceDown() {

  }
}

class TripsStore extends EventEmitter{
  constructor() {
    super();
    this.currentTrip = new Trip()
  }
  emitChange() {
    this.emit(CHANGE_EVENT);
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
