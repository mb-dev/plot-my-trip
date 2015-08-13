import {EventEmitter} from 'events'
import dispatcher from '../dispatcher/dispatcher'
import ActionType from './action_types'

var CHANGE_EVENT = 'change';

class TripsStore  extends EventEmitter{
  constructor() {
    super();
    this.currentTrip = {activePlace: null, locations: []};
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
        this.currentTrip.activePlace = payload.location;
        break;
      case ActionType.ADD_LOCATION:
        console.log(this.currentTrip.activePlace);
        this.currentTrip.locations.push(this.currentTrip.activePlace);
        this.emitChange();
        break;
    }
  }
  getLocations() {
    return this.currentTrip.locations;
  }
}

var store = new TripsStore();
dispatcher.register(store.handleDispatch.bind(store));

export default store;
