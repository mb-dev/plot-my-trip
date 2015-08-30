require('./index.less');

import React, { PropTypes } from 'react';
import { Router, Route, Link } from 'react-router';

import dispather   from './dispatcher/dispatcher.js'
import OptionList  from './components/option_list/option_list'
import MapArea     from './components/map_area/map_area'
import SideBar     from './components/side_bar/side_bar'
import Header      from './components/header/header'
import Footer      from './components/footer/footer'
import userStore   from './users/users_store'
import tripsStore  from './trips/trips_store'


React.render(
  (
    <div>
      <Header />
      <div id="page-content">
        <SideBar />
        <MapArea />
      </div>
      <Footer />
    </div>
  ),
  document.getElementById('welcome')
);

userStore.loadCurrentUser();
tripsStore.load();
