import React, { PropTypes } from 'react';
import { Router, Route, Link } from 'react-router';

import dispather  from './dispatcher/dispatcher.js'
import OptionList from './components/option_list/option_list.jsx'
import MapArea    from './components/map_area/map_area.jsx'
import Header     from './components/header/header.jsx'

var TripStore = {}

React.render(
  (
    <div>
      <Header />
      <div id="page-content">
        <div id="days">
          <OptionList />
        </div>
        <MapArea />
      </div>
    </div>
  ),
  document.getElementById('welcome')
);
