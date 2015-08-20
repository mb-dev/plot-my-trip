import React from 'react';
import classNames from 'classNames'
import { DropTarget } from 'react-dnd';

import dispatcher from '../../dispatcher/dispatcher'
import ActionType from '../../trips/action_types'
import tripsStore from '../../trips/trips_store'
import GroupMember from './group_member'

require('./group.less');

const LocationItem = 'location';

const locationTarget = {
  canDrop(props, monitor) {
    return monitor.getItem().groupId !== props.group.id;
  },
  drop(props, monitor) {
    dispatcher.dispatch({
      actionType: ActionType.GROUPS.ADD_PLACE_TO_GROUP,
      groupId: props.group.id,
      locationId: monitor.getItem().id
    });
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
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
  }
  onTripsStoreChange() {
    let members = tripsStore.currentTrip.getGroupMembers(this.props.group.id);
    this.setState({groupMembers: members});
  }
  onSelectGroup() {

  }
  componentDidMount() {
    tripsStore.addChangeListener(this.onTripsStoreChange);
  }
  componentWillUnmount() {
    tripsStore.removeChangeListener(this.onTripsStoreChange);
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
      return (<GroupMember key={location.id} location={location} />);
    });

    return connectDropTarget(
      <div className={groupClassName}>
        <h4>{this.props.group.name}</h4>
        <div className="group-controls">
          <a>Delete Group</a>
        </div>
        <ul className="group-members">
          {groupMembers}
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
