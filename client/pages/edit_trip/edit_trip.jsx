import React from 'react';
import {Link} from 'react-router';

import tripsStore from '../../stores/trips_store';

import SideBar     from '../../components/side_bar/side_bar';
import MapArea     from '../../components/map_area/map_area';

require('./edit_trip.less');

export default class EditTrip extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
  }
  componentWillMount() {
    this.setStoreState(this.props);
  }
  componentDidMount() {
    tripsStore.addChangeListener(this.onTripsStoreChange);
    document.body.classList.add('edit-page');
  }
  componentWillReceiveProps(props) {
    this.setStoreState(props);
  }
  componentWillUnmount() {
    tripsStore.removeChangeListener(this.onTripsStoreChange);
    document.body.classList.remove('edit-page');
  }
  onTripsStoreChange() {

  }
  setStoreState(props) {
    tripsStore.setActiveTrip(props.params.tripId, props.params.regionName);
  }
  render() {
    return (
      <div id="page-content" className="edit-trip">
        <SideBar />
        <MapArea />
      </div>
    );
  }
}
