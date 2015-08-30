var config = {
  apiServer: 'http://www.plot-my-trip.local.com:8000',
  httpServer: 'http://localhost:8080/webpack-dev-server/'
}

// production settings
if (window.location.href.indexOf('plot-my-trip.com') > 0) {
  config = {
    apiServer: 'http://www.plot-my-trip.com',
    httpServer: 'http://www.plot-my-trip.com'
  }
}

export default config;
