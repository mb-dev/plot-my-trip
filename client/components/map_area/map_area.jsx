import React, { PropTypes } from 'react';

import GoogleMapsService from '../../libraries/google_maps/google_maps.js'
import dispatcher from '../../dispatcher/dispatcher.js'
import ActionType from '../../stores/action_types'
import tripsStore from '../../stores/trips_store'
import converter  from '../../stores/converter'

require('./map_area.less');

var googleMapsService = new GoogleMapsService();

function locationToMapLocation(location) {
  return {
    id: location.id,
    position: location.googleData.position,
    group: location.groupId,
    color: tripsStore.currentTrip.getColorOfGroup(location.groupId)
  };
}

export default class MapArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {locations: [], activeLocation: null, activeRegion: null};
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
    this.onAddRegion = this.onAddRegion.bind(this);
  }
  componentWillMount() {

  }
  componentDidMount() {
    googleMapsService.createMap(this.refs.mapCanvas.getDOMNode());
    googleMapsService.createAutoComplete(this.refs.autoComplete.getDOMNode());
    googleMapsService.addHandler('onPlaceChanged', function(place) {
      let googleData = converter.placeToLocation(place);
      dispatcher.dispatch({actionType: ActionType.LOCATIONS.PLACE_CHANGED, googleData: googleData});
    });
    tripsStore.addChangeListener(this.onTripsStoreChange);
    this.updateState(this.props);
  }
  componentWillUnmount() {
    tripsStore.removeChangeListener(this.onTripsStoreChange);
  }
  onAddRegion() {
    dispatcher.dispatch({actionType: ActionType.REGIONS.ADD_REGION});
  }
  updateState(props) {
    if (!tripsStore.currentTrip) {
      return;
    }
    let activeLocation = tripsStore.currentTrip.getActiveLocation();
    let activeRegion = tripsStore.currentTrip.getActiveRegion();
    let activeGroup = tripsStore.currentTrip.getActiveGroup();
    let locations = [];

    if (activeLocation) {
      googleMapsService.findPlace(activeLocation.position, activeLocation.viewport);
    } else {
      googleMapsService.clearPlace();
      let groupNameNode = React.findDOMNode(this.refs.autoComplete);
      if (groupNameNode) {
        groupNameNode.value = "";
      }
    }

    if (activeRegion) {
      googleMapsService.setCenterAndBounds(activeRegion.googleData.position, activeRegion.googleData.viewport);

      if (activeGroup) {
        locations = tripsStore.currentTrip.getGroupMembers(activeGroup.id).map(locationToMapLocation);
        googleMapsService.displayDirections(locations);
      } else {
        locations = tripsStore.currentTrip.getLocationsInRegion(activeRegion.id).map(locationToMapLocation);
        googleMapsService.displayLocations(locations);
      }
    }

    this.setState({locations: locations, activeLocation: activeLocation, activeRegion: activeRegion, activeGroup: activeGroup});
  }
  onTripsStoreChange() {
    this.updateState(this.props);
  }
  onSubmit(e) {
    return false;
  }
  render() {
    let currentDay = {number: 1};
    let addAsRegionBtn = <button onClick={this.onAddRegion} className="btn btn-default">Add As Region</button>

    return (
      <div id="map-area">
        <form className="form-inline" onSubmit={this.onSubmit}>
          <div className="form-group">
            <label> Search: &nbsp;</label>
            <input className="form-control" id="autocomplete" ref="autoComplete" type="text"/>
          </div>
          <button className="btn btn-primary" type="primary" onClick={this.onSearch}>
            <i className="fa fa-search"></i>
          </button>
          {this.state.activeLocation && addAsRegionBtn}
        </form>
        <div id="map-canvas" ref="mapCanvas"></div>
      </div>
    );
  }
}
