import React from 'react';
import dispatcher from '../../dispatcher/dispatcher'
import ActionType from '../../trips/action_types'
import tripsStore from '../../trips/trips_store'
import MousetrapMixin from '../../libraries/mousetrap_mixin/mousetrap_mixin'
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import { DragDropContext } from 'react-dnd';

import Group from '../group/group'
import GroupMember from '../group/group_member'

require('./option_list.less');

@DragDropContext(HTML5Backend)
class OptionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {locations: [], groups: []};
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
    dispatcher.dispatch({actionType: ActionType.LOCATIONS.ADD_LOCATION});
  }
  addGroup() {
    let groupName = React.findDOMNode(this.refs.groupNameInput).value;
    dispatcher.dispatch({actionType: ActionType.GROUPS.ADD_GROUP, groupName: groupName});
  }
  onTripsStoreChange() {
    this.setState({locations: tripsStore.currentTrip.getUnassignedLocations(), groups: tripsStore.currentTrip.getGroups()});
  }
  componentDidMount() {
    tripsStore.addChangeListener(this.onTripsStoreChange);
  }
  componentWillUnmount() {
    tripsStore.removeChangeListener(this.onTripsStoreChange);
  }
  render() {
    var selectedIndex = this.state.selectedIndex;
    var locationNodes = this.state.locations.map(function(location, index) {
      var className = index == selectedIndex ? 'selected' : '';
      return (<GroupMember key={location.id} location={location} />);
    });
    var groupNodes = this.state.groups.map(function(group, index) {
      var className = '';
      return (<Group key={group.id} group={group} />);
    });
    return (
      <div id="days">
        <h2>Groups:</h2>
        <div className="form-inline">
          <input ref="groupNameInput" type="text" className="form-control"></input><button className="btn btn-default" onClick={this.addGroup}>Add</button>
        </div>
        {groupNodes}
        <h2>Scrape Book:</h2>
        <a href="#" onClick={this.addPlace}>Add</a>
        <ul>
          {locationNodes}
        </ul>
      </div>
    );
  }
}

OptionList.defaultProps = {selectedIndex: 0};

export default OptionList;
