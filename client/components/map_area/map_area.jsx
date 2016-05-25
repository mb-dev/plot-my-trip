import React, {PropTypes} from 'react';

import GoogleMapsService from '../../libraries/google_maps/google_maps';
import dispatcher from '../../dispatcher/dispatcher';
import ActionType from '../../stores/action_types';
import store from '../../stores/store';
import converter  from '../../stores/converter';
import Location from './location';
import Locations from './locations';

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

function locationKey(location) {
  return `${location.id}-${location.color.file}-${location.index}-${location.focused}`;
}

export default class MapArea extends React.Component {
  static propTypes = {
    editable: React.PropTypes.bool,
  }
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
    googleMapsService.addHandler('onPlaceChanged', (place) => {
      const googleData = converter.placeToLocation(place);
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
  onTripsStoreChange() {
    this.updateState(this.props);
  }
  onSubmit(e) {
    e.preventDefault();
  }
  updateState() {
    if (!store.currentTrip) {
      return;
    }
    const activeRegion = store.currentTrip.getActiveRegion();
    const activeLocation = store.currentTrip.getActiveLocation();
    const activeGroup = store.currentTrip.getActiveGroup();
    const focusLocationId = store.currentTrip.getFocusLocation();
    const indexByGroup = {};
    const visibleGroups = store.state.viewTrip.visibleGroups;
    let locations = store.currentTrip.getLocationsInRegion(activeRegion.id).map(locationToMapLocation);

    locations.forEach((location) => {
      if (location.id === focusLocationId) {
        location.focused = true;
      }
      if (!location.group) {
        location.group = 'none';
      }
      indexByGroup[location.group] = indexByGroup[location.group] || 0;
      indexByGroup[location.group] = location.index = indexByGroup[location.group] + 1;
      location.key = locationKey(location);
    });
    if (visibleGroups.length > 0) {
      locations = locations.filter(location => visibleGroups.indexOf(location.group) >= 0);
    }
    if (!activeLocation) {
      const groupNameNode = this.refs.autoComplete;
      if (groupNameNode) {
        groupNameNode.value = '';
      }
    }

    googleMapsService.setState({
      activeRegion: activeRegion,
      activeLocation: activeLocation,
    });

    this.setState({
      locations: locations,
      activeLocation: activeLocation,
      activeRegion: activeRegion,
      activeGroup: activeGroup,
      focusLocationId: focusLocationId,
    });
  }
  render() {
    const addAsRegionBtn = <button onClick={this.onAddRegion} className="btn btn-default">Add Another City</button>;
    const addToScrapeBook = <button onClick={this.onAddToScrape} className="btn btn-default">Add to Scrape Book</button>;

    return (
      <div id="map-area">
        <form className="form-inline" onSubmit={this.onSubmit}>
          <div className="form-group">
            <label> Search: &nbsp;</label>
            <input className="form-control" id="autocomplete" ref="autoComplete" type="text" />
          </div>
          <button className="btn btn-primary" type="primary" onClick={this.onSearch}>
            <i className="fa fa-search"></i>
          </button>
          {this.props.editable && this.state.activeLocation && addAsRegionBtn}
          {this.props.editable && this.state.activeLocation && addToScrapeBook}
        </form>
        <div id="map-canvas" ref="mapCanvas"></div>
        <Locations >
          {this.state.locations.map((location) => (
            <Location
              key={location.id}
              position={location.position}
              index={location.index}
              mapsService={googleMapsService}
              color={location.color}
              focused={location.focused}
              locationKey={location.key}
            />
          ))}
        </Locations>
      </div>
    );
  }
}
