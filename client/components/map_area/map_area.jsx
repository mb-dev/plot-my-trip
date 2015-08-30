import React, { PropTypes } from 'react';

import GoogleMapsService from '../../libraries/google_maps/google_maps.js'
import dispatcher from '../../dispatcher/dispatcher.js'
import ActionType from '../../trips/action_types'
import tripsStore from '../../trips/trips_store'

require('./map_area.less');

var googleMapsService = new GoogleMapsService();

function placeToLocation(place) {
  let country = '';
  let city = '';

  place.address_components.forEach(function(component, index) {
    if(component.types.indexOf('country') >= 0) {
      country = component.long_name;
    } else if(index > 0 && component.types.indexOf('locality') >= 0) {
      city = component.long_name;
    }
  });

  let location = place.geometry.location;

  let data = {
    types: place.types,
    place_id: place.place_id,
    name: place.name,
    position: {lat: location.lat(), lng: location.lng()},
    country: country,
    city: city
  };

  if (place.geometry.viewport) {
    let northeast = place.geometry.viewport.getNorthEast();
    let southwest = place.geometry.viewport.getSouthWest();
    data.viewport = {sw: {lat: southwest.lat(), lng: southwest.lng()}, ne: {lat: northeast.lat(), lng: northeast.lng()}};
  }

  return data;
}

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
  componentDidMount() {
    googleMapsService.createMap(this.refs.mapCanvas.getDOMNode());
    googleMapsService.createAutoComplete(this.refs.autoComplete.getDOMNode());
    googleMapsService.addHandler('onPlaceChanged', function(place) {
      let googleData = placeToLocation(place);
      dispatcher.dispatch({actionType: ActionType.LOCATIONS.PLACE_CHANGED, googleData: googleData});
    });
    tripsStore.addChangeListener(this.onTripsStoreChange);
  }
  componentWillUnmount() {
    tripsStore.removeChangeListener(this.onTripsStoreChange);
  }
  onAddRegion() {
    dispatcher.dispatch({actionType: ActionType.REGIONS.ADD_REGION});
  }
  onTripsStoreChange() {
    let activeLocation = tripsStore.currentTrip.getActiveLocation();
    let activeRegion = tripsStore.currentTrip.getActiveRegion();
    let activeGroup = tripsStore.currentTrip.getActiveGroup();
    let locations = [];

    if (activeLocation) {
      googleMapsService.findPlace(activeLocation.position, activeLocation.viewport);
    } else {
      googleMapsService.clearPlace();
      let groupNameNode = React.findDOMNode(this.refs.autoComplete);
      groupNameNode.value = "";
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
  onSubmit(e) {
    return false;
  }
  render() {
    let currentDay = {number: 1};
    let autoCompleteStyle = {'margin': '15px 0', 'width': '368px'};
    let addAsRegionBtn = <button onClick={this.onAddRegion} className="btn btn-default">Add As Region</button>

    return (
      <div id="map-area">
        <form className="form-inline" onSubmit={this.onSubmit}>
          <div className="form-group">
            <label> Search: &nbsp;</label>
            <input className="form-control add-to-day" id="autocomplete" ref="autoComplete" type="text" style={autoCompleteStyle}/>
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
