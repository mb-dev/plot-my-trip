import storage from '../libraries/storage/storage'
import dispatcher from '../dispatcher/dispatcher'
import ActionType from '../stores/action_types'
import apiClient from '../libraries/api_client/api_client'

import userStore   from '../stores/users_store'
import tripsStore  from '../stores/trips_store'

export default {
  createTrip: function(initialPlace, router) {
    dispatcher.dispatch({actionType: ActionType.TRIPS.CREATE_TRIP, initialPlace: initialPlace});
    router.transitionTo('edit', {tripId: 'new'});
  }
}
