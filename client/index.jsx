require('./index.less');

import React, { PropTypes } from 'react';
import Router, { Route, DefaultRoute, NotFoundRoute, Link } from 'react-router';

import dispather   from './dispatcher/dispatcher.js'

import userStore   from './stores/users_store'
import tripsStore  from './stores/trips_store'

import App            from './pages/app/app'
import Logout         from './pages/logout/logout'
import GoogleCallback from './pages/google_callback/google_callback'
import EditTrip       from './pages/edit_trip/edit_trip'
import Welcome        from './pages/welcome/welcome'

var routes = (
  <Route name="home" handler={App} path="/">
    <DefaultRoute handler={Welcome} />
    <Route name="logout" path="logout" handler={Logout} />
    <Route name="google_callback" path="auth/google/callback" handler={GoogleCallback} />
    <Route name="edit" path="edit/:tripId?/:regionName?" handler={EditTrip} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});

userStore.loadCurrentUser();
tripsStore.load();
