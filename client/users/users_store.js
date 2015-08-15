import {EventEmitter} from 'events'

import Cookies from 'cookies-js'

var CHANGE_EVENT = 'change';

class UserStore extends EventEmitter {
  constructor() {
    super();
    this.currentUser = null;
  }
  getBearerToken() {
    return Cookies.get('token');
  }
  getCurrentUser() {
    return this.currentUser;
  }
  loadCurrentUser() {
    if (this.currentUser) {
      return;
    }
    let bearerToken = this.getBearerToken();
    if (!bearerToken) {
      return;
    }
    $.ajax({
      url: '/api/auth/get-user',
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + bearerToken);
      },
      success: (data) => {
        this.currentUser = data;
        this.emitChange();
      }
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
