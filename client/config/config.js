var config = {
  apiServer: 'http://www.plot-my-trip.local.com:8000',
  httpServer: 'http://localhost:8080/webpack-dev-server/',
  iconServer: 'https://s3-us-west-1.amazonaws.com/plot-my-trip/'
}

// production settings
if (window.location.href.indexOf('plot-my-trip.com') > 0) {
  config = {
    apiServer: 'http://www.plot-my-trip.com',
    httpServer: 'http://www.plot-my-trip.com',
    iconServer: 'https://s3-us-west-1.amazonaws.com/plot-my-trip/'
  }
}

export default config;
