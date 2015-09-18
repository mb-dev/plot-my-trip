import storage from '../libraries/storage/storage'
import dispatcher from '../dispatcher/dispatcher'
import ActionType from '../stores/action_types'
import apiClient from '../libraries/api_client/api_client'

import userStore   from '../stores/users_store'
import tripsStore  from '../stores/trips_store'

var actions = {}

actions.createTrip = function(initialPlace, router) {
    dispatcher.dispatch({actionType: ActionType.TRIPS.CREATE_TRIP, initialPlace: initialPlace});
    setTimeout(function() {
      router.transitionTo('edit', {tripId: 'new'});
    }, 100);
  }

actions.saveTrip = function(router) {
  let newTrip = !tripsStore.currentTrip.data._id
  tripsStore.save(() => {
    if (newTrip && !!tripsStore.currentTrip.data._id) {
      setTimeout(function() {
        router.transitionTo('edit', {tripId: tripsStore.currentTrip.data._id});
      }, 100);
    }
  });
}



// ----------------
// locations

actions.modifyLocation = function(locationId, newData) {
  dispatcher.dispatch({actionType: ActionType.LOCATIONS.EDIT_LOCATION, locationId: locationId, newData: newData});
}

actions.deleteLocation = function(location) {
  dispatcher.dispatch({actionType: ActionType.LOCATIONS.DELETE_LOCATION, locationId: location.id});
}

actions.setFocusLocation = function(locationId) {
  dispatcher.dispatch({actionType: ActionType.LOCATIONS.FOCUS_LOCATION, locationId: locationId});
}


export default actions;
