import {EventEmitter} from 'events'
import apiClient from '../libraries/api_client/api_client'

var CHANGE_EVENT = 'change';

class UserStore extends EventEmitter {
  constructor() {
    super();
    this.currentUser = null;
  }
  getCurrentUser() {
    return this.currentUser;
  }
  loadCurrentUser() {
    if (this.currentUser) {
      return;
    }

    apiClient.getCurrentUser((data) => {
      this.currentUser = data;
      this.emitChange();
    });
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
}

var userStore = new UserStore();
export default userStore;
