import React, {PropTypes} from 'react';

import GoogleMapsService from '../../libraries/google_maps/google_maps';
import dispatcher from '../../dispatcher/dispatcher';
import ActionType from '../../stores/action_types';
import store from '../../stores/store';
import converter  from '../../stores/converter';

require('./map_area.less');

const googleMapsService = new GoogleMapsService();

function locationToMapLocation(location) {
  return {
    id: location.id,
    position: location.googleData.position,
    group: location.groupId,
    color: store.currentTrip.getColorOfGroup(location.groupId),
  };
}

export default class MapArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {locations: [], activeLocation: null, activeRegion: null};
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
    this.onAddRegion = this.onAddRegion.bind(this);
    this.onAddToScrape = this.onAddToScrape.bind(this);
  }
  componentWillMount() {

  }
  componentDidMount() {
    googleMapsService.createMap(this.refs.mapCanvas);
    googleMapsService.createAutoComplete(this.refs.autoComplete);
    googleMapsService.addHandler('onPlaceChanged', function(place) {
      let googleData = converter.placeToLocation(place);
      dispatcher.dispatch({actionType: ActionType.LOCATIONS.PLACE_CHANGED, googleData: googleData});
    });
    store.addChangeListener(this.onTripsStoreChange);
    this.updateState(this.props);
  }
  componentWillUnmount() {
    store.removeChangeListener(this.onTripsStoreChange);
  }
  onAddRegion() {
    dispatcher.dispatch({actionType: ActionType.REGIONS.ADD_REGION});
  }
  onAddToScrape() {
    dispatcher.dispatch({actionType: ActionType.LOCATIONS.ADD_LOCATION, regionId: this.state.activeRegion.id});
  }
  updateState(props) {
    if (!store.currentTrip) {
      return;
    }
    let activeGroup = store.currentTrip.getActiveGroup();
    let focusLocationId = store.currentTrip.getFocusLocation();
    let locations = [];
    let mapState = {
      activeRegion: store.currentTrip.getActiveRegion(),
      activeLocation: store.currentTrip.getActiveLocation(),
    };

    if (!mapState.activeLocation) {
      let groupNameNode = this.refs.autoComplete;
      if (groupNameNode) {
        groupNameNode.value = "";
      }
    }

    if (mapState.activeRegion) {
      if (activeGroup) {
        mapState.locations = store.currentTrip.getGroupMembers(mapState.activeGroup.id).map(locationToMapLocation);
        mapState.displayStyle = 'directions';
      } else {
        mapState.locations = store.currentTrip.getLocationsInRegion(mapState.activeRegion.id).map(locationToMapLocation);
        mapState.displayStyle = 'locations';
      }

      mapState.locations.forEach(function(location) {
        if (location.id == focusLocationId) {
          location.focused = true;
        }
      });
    }

    googleMapsService.setState(mapState);

    this.setState({
      locations: locations,
      activeLocation: mapState.activeLocation,
      activeRegion: mapState.activeRegion,
      activeGroup: activeGroup,
      focusLocationId: focusLocationId
    });
  }
  onTripsStoreChange() {
    this.updateState(this.props);
  }
  onSubmit(e) {
    return false;
  }
  render() {
    let currentDay = {number: 1};
    let addAsRegionBtn = <button onClick={this.onAddRegion} className="btn btn-default">Add Another City</button>
    let addToScrapeBook = <button onClick={this.onAddToScrape} className="btn btn-default">Add to Scrape Book</button>

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
          {this.state.activeLocation && addToScrapeBook}
        </form>
        <div id="map-canvas" ref="mapCanvas"></div>
      </div>
    );
  }
}
