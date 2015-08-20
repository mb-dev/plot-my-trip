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

  return {
    types: place.types,
    place_id: place.place_id,
    name: place.name,
    position: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
    country: country,
    city: city
  };
}

export default class MapArea extends React.Component {
  constructor(props) {
    super(props);
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
  }
  componentDidMount() {
    googleMapsService.createMap(this.refs.mapCanvas.getDOMNode());
    googleMapsService.createAutoComplete(this.refs.autoComplete.getDOMNode());
    googleMapsService.addHandler('onPlaceChanged', function(place) {
      let googleData = placeToLocation(place);
      dispatcher.dispatch({actionType: ActionType.LOCATIONS.PLACE_CHANGED, googleData: googleData});
    });
    tripsStore.addChangeListener(this.onTripsStoreChange);
    this.state = {locations: []};
  }
  componentWillUnmount() {
    tripsStore.removeChangeListener(this.onTripsStoreChange);
  }
  onTripsStoreChange() {
    let locations = tripsStore.currentTrip.getLocations();
    let activeLocation = tripsStore.currentTrip.getActiveLocation();
    this.setState({locations: locations, activeLocation: activeLocation});
    let locationsForMap = locations.map(location => ({
      id: location.id,
      position: location.googleData.position,
      group: location.groupId
    }));
    if (activeLocation) {
      googleMapsService.findPlace(activeLocation.position);
    } else {
      googleMapsService.clearPlace();
    }

    googleMapsService.displayLocations(locationsForMap);
  }
  onSubmit(e) {
    return false;
  }
  getAllTrips() {
    let bearerToken = Cookies.get('token');
    $.ajax({
      url: '/api/trips',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + bearerToken);
      },
      success: function(data) {
        console.log(data);
      }
    });
  }
  render() {
    var currentDay = {number: 1};
    var autoCompleteStyle = {'margin': '15px 0', 'width': '368px'};
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
        </form>
        <div id="map-canvas" ref="mapCanvas"></div>
        <a onClick={this.getAllTrips} href="#">Get Trips</a>
      </div>
    );
  }
}
