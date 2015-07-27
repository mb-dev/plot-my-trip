import GoogleMapsService from '../../libraries/google_maps/google_maps.js'
import React, { PropTypes } from 'react';

var googleMapsService = new GoogleMapsService();

export default class MapArea extends React.Component {
  componentDidMount() {
    googleMapsService.createMap(this.refs.mapCanvas.getDOMNode());
    googleMapsService.createAutoComplete(this.refs.autoComplete.getDOMNode());
  }
  onSearch() {

  }
  render() {
    var currentDay = {number: 1};
    var autoCompleteStyle = {'margin': '15px 0', 'width': '368px'};
    return (
      <div id="map-area">
        <form className="form-inline">
          <div className="form-group">
            <label> Search: &nbsp;</label>
            <input className="form-control add-to-day" id="autocomplete" ref="autoComplete" type="text" style={autoCompleteStyle}/>
          </div>
          <button className="btn btn-primary" type="primary" onClick={this.onSearch}>
            <i className="fa fa-search"></i>
          </button>
        </form>
        <div id="map-canvas" ref="mapCanvas"></div>
      </div>
    );
  }
}
