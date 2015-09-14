import storage from '../libraries/storage/storage'
import dispatcher from '../dispatcher/dispatcher'
import ActionType from '../stores/action_types'
import apiClient from '../libraries/api_client/api_client'

import userStore   from '../stores/users_store'
import tripsStore  from '../stores/trips_store'

export default {
  createTrip: function(initialPlace, router) {
    dispatcher.dispatch({actionType: ActionType.TRIPS.CREATE_TRIP, initialPlace: initialPlace});
    setTimeout(function() {
      router.transitionTo('edit', {tripId: 'new'});
    }, 100);
  },
  saveTrip: function(router) {
    let newTrip = !tripsStore.currentTrip.data._id
    tripsStore.save(() => {
      if (newTrip && !!tripsStore.currentTrip.data._id) {
        setTimeout(function() {
          router.transitionTo('edit', {tripId: tripsStore.currentTrip.data._id});
        }, 100);
      }
    });
  }
}
