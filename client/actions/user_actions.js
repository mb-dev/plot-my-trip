import storage from '../libraries/storage/storage'
import dispatcher from '../dispatcher/dispatcher'
import ActionType from '../stores/action_types'
import apiClient from '../libraries/api_client/api_client'

import userStore   from '../stores/users_store'
import tripsStore  from '../stores/trips_store'

export default {
  login: function(state, code, router) {
    apiClient.getAuthToken(state, code, () => {
      userStore.loadCurrentUser();
      tripsStore.load();
      this.context.router.transitionTo('home');
    });
  },
  logout: function(router) {
    storage.clearAll();
    dispatcher.dispatch({actionType: ActionType.USER.LOGOUT});
    router.transitionTo('home');
  }
}
