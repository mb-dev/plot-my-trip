require('./index.less');

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import userStore   from './stores/users_store';
import store  from './stores/store';

import App            from './pages/app/app';
import Logout         from './pages/logout/logout';
import GoogleCallback from './pages/google_callback/google_callback';
import EditTrip       from './pages/edit_trip/edit_trip';
import Welcome        from './pages/welcome/welcome';
import HomePage       from './pages/home/home';

require('bootstrap-loader');

render((
  <Router history={browserHistory}>
    <Route component={App} path="/">
      <IndexRoute component={Welcome} />
      <Route path="logout" component={Logout} />
      <Route path="auth/google/callback" component={GoogleCallback} />
      <Route path="trips" component={HomePage} />
      <Route path="trip/(:tripId(/:regionName))" component={EditTrip} />
    </Route>
  </Router>
), document.getElementById('app'));

userStore.loadCurrentUser();
store.load();
