import React, { PropTypes } from 'react';
import Cookies from 'cookies-js'

import GoogleMapsService from '../../libraries/google_maps/google_maps.js'
import dispatcher from '../../dispatcher/dispatcher.js'
import ActionType from '../../trips/action_types'

var googleMapsService = new GoogleMapsService();

function placeToLocation(place) {
  var country = '';

  for (var component of place.address_components) {
    if(component.types.indexOf('country') >= 0) {
      country = component.long_name;
    }
  }

  return {
    name: place.name,
    location: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
    country: country
  };
}

export default class MapArea extends React.Component {
  componentDidMount() {
    googleMapsService.createMap(this.refs.mapCanvas.getDOMNode());
    googleMapsService.createAutoComplete(this.refs.autoComplete.getDOMNode());
    googleMapsService.addHandler('onPlaceChanged', function(place) {
      googleMapsService.findPlace(place);
      dispatcher.dispatch({actionType: ActionType.PLACE_CHANGED, location: placeToLocation(place)});
    });
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
