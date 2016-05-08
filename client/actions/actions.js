import storage from '../libraries/storage/storage';
import dispatcher from '../dispatcher/dispatcher';
import ActionType from '../stores/action_types';
import apiClient from '../libraries/api_client/api_client';
import {browserHistory} from 'react-router';
import userStore   from '../stores/users_store';
import tripsStore  from '../stores/trips_store';

// ----------------
// trips

class Actions {
  login(state, code) {
    apiClient.getAuthToken(state, code, () => {
      userStore.loadCurrentUser();
      tripsStore.load();
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
    const newTrip = !tripsStore.currentTrip.data._id;
    tripsStore.save(() => {
      if (newTrip && !!tripsStore.currentTrip.data._id) {
        setTimeout(() => {
          browserHistory.push(`/trip/${tripsStore.currentTrip.data._id}`);
        }, 100);
      }
    });
  }
  modifyLocation(locationId, newData) {
    dispatcher.dispatch({actionType: ActionType.LOCATIONS.EDIT_LOCATION, locationId: locationId, newData: newData});
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
