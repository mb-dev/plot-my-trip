import React from 'react';
import dispatcher from '../../dispatcher/dispatcher'
import ActionType from '../../trips/action_types'
import tripsStore from '../../trips/trips_store'

import Region from '../region/region'

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

require('./side_bar.less');

@DragDropContext(HTML5Backend)
export default class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
    this.state = {activeLocation: null, activeRegion: null}
  }
  onTripsStoreChange() {
    this.setState({
      activeLocation: tripsStore.currentTrip.getActiveLocation(),
      activeRegion: tripsStore.currentTrip.getActiveRegion()
    });
  }
  componentDidMount() {
    tripsStore.addChangeListener(this.onTripsStoreChange);
  }
  componentWillUnmount() {
    tripsStore.removeChangeListener(this.onTripsStoreChange);
  }
  onPrevRegion() {
    dispatcher.dispatch({actionType: ActionType.REGIONS.SELECT_PREV_REGION});
  }
  onNextRegion() {
    dispatcher.dispatch({actionType: ActionType.REGIONS.SELECT_NEXT_REGION});
  }
  onAddRegion() {
    dispatcher.dispatch({actionType: ActionType.REGIONS.ADD_REGION});
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
    let activeRegionElement = <div className="active-region-name">{activeRegionName}</div>;
    let activeRegionElementCondition = this.state.activeRegion ? activeRegionElement : '';

    return (
      <div id="side-bar">
        <div className="top">
          <a href="" onClick={this.onPrevRegion} className="prev-region">Prev Region</a>
          {activeRegionElementCondition}
          <a href="" onClick={this.onNextRegion} className="next-region">Next Region</a>
        </div>
        {regionElement}
      </div>
    )

  }
}
