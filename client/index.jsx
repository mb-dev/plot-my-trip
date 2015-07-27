import React, { PropTypes } from 'react';

import dispather from './dispatcher/dispatcher.js'
import OptionList from './components/option_list/option_list.jsx'
import MapArea from './components/map_area/map_area.jsx'

var TripStore = {}

console.log(document.getElementById('welcome'));

React.render(
  (<div id="container">
    <div id="days">
      <OptionList />
    </div>
    <MapArea />
  </div>),
  document.getElementById('welcome')
);
