import React from 'react';
import classNames from 'classnames';
import {DropTarget} from 'react-dnd';

import store from '../../stores/store';
import GroupMember from './group_member';
import actions from '../../actions/actions';

require('./group.less');

const LocationItem = 'location';

const locationTarget = {
  canDrop(props, monitor) {
    return monitor.getItem().groupId !== props.group.id;
  },
  drop(props, monitor) {
    if (props.group.id && props.group.id !== 'none') {
      actions.addPlaceToGroup(props.group.id, monitor.getItem().id);
    } else {
      actions.unassignLocation(props.region.id, monitor.getItem().id);
    }
  },
};

@DropTarget(LocationItem, locationTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
export default class Group extends React.Component {
  static propTypes = {
    group: React.PropTypes.object,
    isOver: React.PropTypes.bool.isRequired,
    canDrop: React.PropTypes.bool.isRequired,
    connectDropTarget: React.PropTypes.func.isRequired,
    editable: React.PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.state = {groupMembers: [], selectedGroup: null, groupColor: null};
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
    this.onClickGroup = this.onClickGroup.bind(this);
  }
  componentDidMount() {
    store.addChangeListener(this.onTripsStoreChange);
    // Not sure why this line is needed
    this.onTripsStoreChange();
  }
  componentWillUnmount() {
    store.removeChangeListener(this.onTripsStoreChange);
  }
  onTripsStoreChange() {
    if (!store.currentTrip) {
      return;
    }
    let members = [];
    if (this.props.group.id !== 'none') {
      members = store.currentTrip.getGroupMembers(this.props.group.id);
    } else {
      members = store.currentTrip.getUnassignedLocations();
    }
    const activeGroup = store.currentTrip.getActiveGroup();
    const groupColor = store.currentTrip.getColorOfGroup(this.props.group.id);
    let groupVisible = true;
    if (store.state.viewTrip.visibleGroups.length > 0) {
      groupVisible = store.state.viewTrip.visibleGroups.indexOf(this.props.group.id) >= 0;
    }

    this.setState({
      groupMembers: members,
      activeGroup: activeGroup,
      groupColor: groupVisible ? groupColor.color : 'gray',
    });
  }
  onClickGroup() {
    if (store.state.viewTrip.visibleGroups.length > 0) {
      actions.showAllGroups();
    } else {
      actions.showOnlyGroup(this.props.group.id);
    }
  }
  render() {
    const {canDrop, isOver, connectDropTarget} = this.props;
    const groupClassName = classNames({
      group: true,
      'drag-item-is-over': canDrop && isOver,
      active: this.state.activeGroup && this.state.activeGroup.id === this.props.group.id,
      scrape: !this.props.group.id || this.props.group.id === 'none',
    });

    let groupColorStyle = {backgroundColor: this.state.groupColor};

    return connectDropTarget(
      <div className={groupClassName}>
        {this.props.editable && this.props.group.id &&
          <div className="group-controls">
            <a>Delete Day</a>
          </div>
        }
        <div onClick={this.onClickGroup}>
          <div className="group-color" style={groupColorStyle} />
          <h4>{this.props.group.name}</h4>
        </div>
        {this.state.groupMembers.length === 0 &&
          <div className="no-group-members text-muted">Day has no locations</div>
        }
        <ol className="group-members">
          {this.state.groupMembers.map((location, index) => (
            <GroupMember group={this.props.group} key={location.id} location={location} index={index} editable={this.props.editable} />
          ))}
        </ol>
      </div>
    );
  }
}
