import React from 'react';

import tripsStore from '../../trips/trips_store'
import ActionType from '../../trips/action_types'
import GroupMember from './group_member'

export default class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {groupMembers: []};
  }
  onTripsStoreChange() {
    this.setState({groupMembers: tripsStore.getGroupMembers(group.id)});
  }
  componentDidMount() {
    tripsStore.addChangeListener(this.onTripsStoreChange.bind(this));
  }
  componentWillUnmount() {
    tripsStore.removeChangeListener(this.onTripsStoreChange.bind(this));
  }
  render() {
    var groupMembers = this.state.groups.map(function(group, index) {
      var className = '';
      return (<Group group={group} />);
    });
    return (
      <div className="group">
        <h2>{this.props.group.name}</h2>
        <div className="group-controls">
          <a>Delete Group</a>
        </div>
        <ul>
        </ul>
      </div>
    );
  }
}

Group.propTypes = { group: React.PropTypes.object };
