import React from 'react';
import {Link} from 'react-router';
import dispatcher from '../../dispatcher/dispatcher'
import ActionType from '../../stores/action_types'
import tripsStore from '../../stores/trips_store'
import tripActions from '../../actions/trip_actions'

import Region from '../region/region'

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

require('./side_bar.less');

class SideBar extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {activeLocation: null, activeRegion: null}

    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
    this.onSelectRegion = this.onSelectRegion.bind(this);
  }
  onTripsStoreChange() {
    this.updateState(this.props);
  }
  componentWillMount() {
    this.updateState(this.props);
  }
  componentDidMount() {
    tripsStore.addChangeListener(this.onTripsStoreChange);
  }
  componentWillUnmount() {
    tripsStore.removeChangeListener(this.onTripsStoreChange);
  }
  updateState(props) {
    if (!tripsStore.currentTrip) {
      return;
    }
    let nextRegion = tripsStore.currentTrip.getNextRegion();
    let prevRegion = tripsStore.currentTrip.getPrevRegion();
    this.setState({
      activeLocation: tripsStore.currentTrip.getActiveLocation(),
      activeRegion: tripsStore.currentTrip.getActiveRegion(),
      activeTripId: tripsStore.activeTripId,
      nextRegionName: nextRegion ? nextRegion.name : null,
      prevRegionName: prevRegion ? prevRegion.name : null
    });
  }
  onAddRegion(e) {
    e.preventDefault();
    dispatcher.dispatch({actionType: ActionType.REGIONS.ADD_REGION});
    return false;
  }
  onSelectRegion(e) {
    e.preventDefault();
    dispatcher.dispatch({actionType: ActionType.REGIONS.SELECT_REGION, regionId: this.state.activeRegion.id});
    return false;
  }
  render() {
    let regionRender = <Region region={this.state.activeRegion}></Region>;
    let activeLocationName = this.state.activeLocation ? this.state.activeLocation.name : '';
    let addActiveRegion = <a className="btn btn-primary" href="#" onClick={this.onAddRegion}>Add {activeLocationName} as Region</a>;
    let noRegionAddPart = this.state.activeLocation ? addActiveRegion : "";
    let noRegion = (
      <div className="selectRegion">
        <div>Please select a region.</div>
        {noRegionAddPart}
      </div>
    );

    let regionElement = this.state.activeRegion ? regionRender : noRegion;
    let activeRegionName = this.state.activeRegion ? this.state.activeRegion.name : '';
    let activeRegionElement = <div onClick={this.onSelectRegion} className="active-region-name">{activeRegionName}</div>;

    return (
      <div id="side-bar">
        <div className="top clearfix">
          { this.state.prevRegionName ?
            <Link to="edit" params={{tripId: this.state.activeTripId, regionName: this.state.prevRegionName}} className="prev-region">Prev City</Link>
            :
            <div className="prev-link-placeholder"></div>
          }
          {this.state.activeRegion && activeRegionElement}
          { this.state.nextRegionName &&
            <Link to="edit" params={{tripId: this.state.activeTripId, regionName: this.state.nextRegionName}} className="next-region">Next City</Link>
          }
        </div>
        {regionElement}
      </div>
    )

  }
}

SideBar.contextTypes = {
  router: React.PropTypes.func.isRequired
}
SideBar = DragDropContext(HTML5Backend)(SideBar);
export default SideBar;
