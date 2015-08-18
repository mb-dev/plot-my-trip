import Cookies from 'cookies-js'

class Storage {
  getBearerToken() {
    return Cookies.get('token');
  }
}

var storage = new Storage();

export default storage;
