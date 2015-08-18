import React from 'react';
import classNames from 'classNames'
import { DropTarget } from 'react-dnd';

import tripsStore from '../../trips/trips_store'
import ActionType from '../../trips/action_types'
import GroupMember from './group_member'

require('./group.less');

const LocationItem = 'location';

const locationTarget = {
  drop() {
    console.log('dropped');
  }
};

@DropTarget(LocationItem, locationTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {groupMembers: []};
  }
  onTripsStoreChange() {
    this.setState({groupMembers: tripsStore.currentTrip.getGroupMembers(this.props.group.id)});
  }
  componentDidMount() {
    tripsStore.addChangeListener(this.onTripsStoreChange.bind(this));
  }
  componentWillUnmount() {
    tripsStore.removeChangeListener(this.onTripsStoreChange.bind(this));
  }
  render() {
    const {canDrop, isOver, connectDropTarget} = this.props;
    const isActive = canDrop && isOver;
    const groupClassName = classNames({
      'group': true,
      'drag-item-is-over': isActive
    });

    var groupMembers = this.state.groupMembers.map(function(location, index) {
      var className = '';
      return (<GroupMember location={location} />);
    });

    return connectDropTarget(
      <div className={groupClassName}>
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

Group.propTypes = {
  group: React.PropTypes.object,
  isOver: React.PropTypes.bool.isRequired,
  canDrop: React.PropTypes.bool.isRequired,
  connectDropTarget: React.PropTypes.func.isRequired,
};
