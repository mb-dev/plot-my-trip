import React from 'react';

import tripsStore from '../../stores/trips_store'

import SideBar     from '../../components/side_bar/side_bar'
import MapArea     from '../../components/map_area/map_area'

require('./edit_trip.less');

export default class EditTrip extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
  }
  componentWillMount() {
    this.setStoreState();
  }
  componentDidMount() {
    tripsStore.addChangeListener(this.onTripsStoreChange);
  }
  componentWillUnmount() {
    tripsStore.removeChangeListener(this.onTripsStoreChange);
  }
  setStoreState() {
    tripsStore.setActiveTrip(this.props.params.tripId);
  }
  onTripsStoreChange() {

  }
  render() {
    return (
      <div id="page-content" className="edit-trip">
        <SideBar />
        <MapArea />
      </div>
    )
  }
}

EditTrip.contextTypes = {
  router: React.PropTypes.func.isRequired
}
