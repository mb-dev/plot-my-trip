import React from 'react';
import dispatcher from '../../dispatcher/dispatcher'
import ActionType from '../../trips/action_types'
import tripsStore from '../../trips/trips_store'
import MousetrapMixin from '../../libraries/mousetrap_mixin/mousetrap_mixin'

import Group from '../group/group'
import GroupMember from '../group/group_member'

require('./region.less');

export default class Region extends React.Component {
  constructor(props) {
    super(props);
    this.state = {scrapeLocations: [], groups: [], activeLocation: null};
    this.mouseTrap = new MousetrapMixin();

    this.addPlace = this.addPlace.bind(this);
    this.addGroup = this.addGroup.bind(this);
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
  }
  onKeyUp(e) {
    this.setState({selectedIndex: this.state.selectedIndex - 1});
  }
  onKeyDown(e) {
    this.setState({selectedIndex: this.state.selectedIndex + 1});
  }
  addPlace() {
    dispatcher.dispatch({actionType: ActionType.LOCATIONS.ADD_LOCATION, regionId: this.props.region.id});
  }
  addGroup() {
    let groupNameNode = React.findDOMNode(this.refs.groupNameInput)
    let groupName = groupNameNode.value;
    dispatcher.dispatch({actionType: ActionType.GROUPS.ADD_GROUP, regionId: this.props.region.id, groupName: groupName});
    groupNameNode.value = '';
  }
  onTripsStoreChange() {
    this.updateState(this.props);

  }
  updateState(props) {
    this.setState({
      activeLocation: tripsStore.currentTrip.getActiveLocation(),
      scrapeLocations: tripsStore.currentTrip.getRegionScrapeLocations(props.region.id),
      groups: tripsStore.currentTrip.getGroupsInRegion(props.region.id)
    });
  }
  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }
  componentDidMount() {
    tripsStore.addChangeListener(this.onTripsStoreChange);
    this.onTripsStoreChange();
  }
  componentWillUnmount() {
    tripsStore.removeChangeListener(this.onTripsStoreChange);
  }
  onSubmit() {
    return false;
  }
  render() {
    let selectedIndex = this.state.selectedIndex;
    let locationNodes = this.state.scrapeLocations.map(function(location, index) {
      var className = index == selectedIndex ? 'selected' : '';
      return (<GroupMember key={location.id} location={location} />);
    });
    let groupNodes = this.state.groups.map(function(group, index) {
      var className = '';
      return (<Group key={group.id} group={group} />);
    });
    let addPlace = <a className="add-place" href="#" onClick={this.addPlace}>Add</a>;
    let addPlaceCondition = this.state.activeLocation ? addPlace : '';

    return (
      <div id="region">
        <form className="add-group-form form-inline" onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Group Name:</label>
            <input ref="groupNameInput" type="text" className="form-control"></input><button className="btn btn-default" onClick={this.addGroup}>Add</button>
          </div>
        </form>
        {groupNodes}

        {addPlaceCondition}
        <h4>Scrape Book:</h4>

        <ul className="scrape-locations">
          {locationNodes}
        </ul>
      </div>
    );
  }
}

Region.propTypes = {
  region: React.PropTypes.object,
};
