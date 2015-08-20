import config from '../../config/config'
import storage from '../storage/storage'

class ApiClient {
  getGoogleAuthUrl(success) {
    $.get(config.apiServer + '/api/auth/google', success);
  }
  getCurrentUser(success) {
    let bearerToken = storage.getBearerToken();
    if (!bearerToken) {
      return;
    }

    $.ajax({
      url: config.apiServer + '/api/auth/get-user',
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + bearerToken);
      },
      success: success
    });
  }
  getTrips(success) {
    let bearerToken = storage.getBearerToken();
    if (!bearerToken) {
      return;
    }

    $.ajax({
      url: config.apiServer + '/api/trips',
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + bearerToken);
      },
      success: success
    });
  }
  updateTrips(tripData, success, failure) {
    let bearerToken = storage.getBearerToken();
    if (!bearerToken) {
      return;
    }

    $.ajax({
      url: config.apiServer + '/api/trips/update-trip',
      data: JSON.stringify(tripData),
      dataType: "json",
      contentType: "application/json",
      method: 'post',
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + bearerToken);
      },
      success: success,
      failure: failure
    });
  }
}

var apiClient = new ApiClient();

export default apiClient;
