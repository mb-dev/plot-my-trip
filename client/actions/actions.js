import storage from '../libraries/storage/storage';
import dispatcher from '../dispatcher/dispatcher';
import ActionType from '../stores/action_types';
import apiClient from '../libraries/api_client/api_client';
import {browserHistory} from 'react-router';
import userStore   from '../stores/users_store';
import store  from '../stores/store';

// ----------------
// trips

class Actions {
  login(state, code) {
    apiClient.getAuthToken(state, code, () => {
      userStore.loadCurrentUser();
      store.load();
      browserHistory.push('/trips');
    });
  }
  logout() {
    storage.clearAll();
    dispatcher.dispatch({actionType: ActionType.USER.LOGOUT});
    browserHistory.push('/');
  }

  createTrip(initialPlace) {
    dispatcher.dispatch({actionType: ActionType.TRIPS.CREATE_TRIP, initialPlace: initialPlace});
    setTimeout(() => {browserHistory.push('/trip/new');}, 100);
  }
  saveTrip() {
    const newTrip = !store.currentTrip.data._id;
    store.save(() => {
      if (newTrip && !!store.currentTrip.data._id) {
        setTimeout(() => {
          browserHistory.push(`/trip/${store.currentTrip.data._id}`);
        }, 100);
      }
    });
  }
  viewTrip(tripId, editMode) {
    dispatcher.dispatch({actionType: ActionType.TRIPS.VIEW_TRIP, tripId: tripId, editMode: editMode});
  }
  editLocation(locationId) {
    dispatcher.dispatch({actionType: ActionType.LOCATIONS.EDIT_LOCATION, locationId: locationId});
  }
  editLocationOk(locationId, newData) {
    dispatcher.dispatch({actionType: ActionType.LOCATIONS.EDIT_LOCATION_OK, locationId: locationId, newData: newData});
  }
  editLocationClosed() {
    dispatcher.dispatch({actionType: ActionType.LOCATIONS.EDIT_LOCATION_CLOSED});
  }
  deleteLocation(location) {
    dispatcher.dispatch({actionType: ActionType.LOCATIONS.DELETE_LOCATION, locationId: location.id});
  }
  setFocusLocation(locationId) {
    dispatcher.dispatch({actionType: ActionType.LOCATIONS.FOCUS_LOCATION, locationId: locationId});
  }
  moveLocationUp(locationId) {
    dispatcher.dispatch({actionType: ActionType.LOCATIONS.MOVE_LOCATION_UP, locationId: locationId});
  }
  moveLocationDown(locationId) {
    dispatcher.dispatch({actionType: ActionType.LOCATIONS.MOVE_LOCATION_DOWN, locationId: locationId});
  }
}

const actions = new Actions();
export default actions;
