import React from 'react';
import {Link} from 'react-router';
import dispatcher from '../../dispatcher/dispatcher';
import ActionType from '../../stores/action_types';
import store from '../../stores/store';

import Region from '../region/region';

import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

require('./side_bar.less');

@DragDropContext(HTML5Backend)
class SideBar extends React.Component {
  static propTypes = {
    editable: React.PropTypes.bool,
  }
  constructor(props, context) {
    super(props, context);

    this.state = {activeLocation: null, activeRegion: null};

    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
    this.onSelectRegion = this.onSelectRegion.bind(this);
  }
  componentWillMount() {
    this.updateState(this.props);
  }
  componentDidMount() {
    store.addChangeListener(this.onTripsStoreChange);
  }
  componentWillReceiveProps(props) {
    this.updateState(props);
  }
  componentWillUnmount() {
    store.removeChangeListener(this.onTripsStoreChange);
  }
  onTripsStoreChange() {
    this.updateState(this.props);
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
  updateState() {
    if (!store.currentTrip) {
      return;
    }
    const nextRegion = store.currentTrip.getNextRegion();
    const prevRegion = store.currentTrip.getPrevRegion();
    this.setState({
      activeLocation: store.currentTrip.getActiveLocation(),
      activeRegion: store.currentTrip.getActiveRegion(),
      activeTripId: store.activeTripId,
      nextRegionName: nextRegion ? nextRegion.name : null,
      prevRegionName: prevRegion ? prevRegion.name : null,
    });
  }
  render() {
    const regionRender = <Region region={this.state.activeRegion} editable={this.props.editable} />;
    const activeLocationName = this.state.activeLocation ? this.state.activeLocation.name : '';
    const addActiveRegion = <a className="btn btn-primary" href="#" onClick={this.onAddRegion}>Add {activeLocationName} as Region</a>;
    const noRegionAddPart = this.state.activeLocation ? addActiveRegion : '';
    const noRegion = (
      <div className="selectRegion">
        <div>Please select a region.</div>
        {noRegionAddPart}
      </div>
    );

    const activeRegionName = this.state.activeRegion ? this.state.activeRegion.name : '';

    return (
      <div id="side-bar">
        <div className="top clearfix">
          { this.state.prevRegionName ?
            <Link to={`/trip/${this.state.activeTripId}/${this.state.prevRegionName}`} className="prev-region">Prev City</Link>
            :
            <div className="prev-link-placeholder"></div>
          }
          { this.state.activeRegion &&
            <div onClick={this.onSelectRegion} className="active-region-name">{activeRegionName}</div>
          }
          { this.state.nextRegionName &&
            <Link to={`/trip/${this.state.activeTripId}/${this.state.nextRegionName}`} className="next-region">Next City</Link>
          }
        </div>
        { this.state.activeRegion ? regionRender : noRegion }
      </div>
    );
  }
}

export default SideBar;
