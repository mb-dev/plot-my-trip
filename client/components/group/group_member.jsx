import React from 'react';
import { DragSource } from 'react-dnd';
import {Modal} from 'react-bootstrap'

import dispatcher from '../../dispatcher/dispatcher.js'
import ActionType from '../../stores/action_types'
import tripActions from '../../actions/trip_actions'

const groupSource = {
  beginDrag(props) {
    return {
      id: props.location.id,
      groupId: props.location.groupId
    };
  }
};

const LocationItem = 'location';

@DragSource(LocationItem, groupSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class GroupMember extends React.Component {
  constructor(props) {
    super(props);
    this.onDeleteLocation = this.onDeleteLocation.bind(this);
    this.onEditLocation = this.onEditLocation.bind(this);
    this.onEditLocationSave = this.onEditLocationSave.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.moveLocationUp = this.moveLocationUp.bind(this);
    this.moveLocationDown = this.moveLocationDown.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {editing: false};
  }
  onDeleteLocation() {
    tripActions.deleteLocation(this.props.location);
  }
  onEditLocation() {
    this.setState({editing: true});
  }
  closeModal() {
    this.setState({editing: false});
  }
  onSubmit(e) {
    e.preventDefault();
    return false;
  }
  onEditLocationSave(e) {
    let nameNode = React.findDOMNode(this.refs.locationNameInput);
    let commentsNode = React.findDOMNode(this.refs.locationCommentsInput);
    tripActions.modifyLocation(this.props.location.id, {name: nameNode.value, comments: commentsNode.value});
    this.setState({editing: false});
  }
  moveLocationUp() {
    tripActions.moveLocationUp(this.props.location.id);
  }
  moveLocationDown() {
    tripActions.moveLocationDown(this.props.location.id);
  }
  onMouseEnter() {
    tripActions.setFocusLocation(this.props.location.id);
  }
  onMouseLeave() {
    tripActions.setFocusLocation(null);
  }
  render() {
    const { isDragging, connectDragSource, text } = this.props;
    const component = (
      <li style={{ opacity: isDragging ? 0.5 : 1 }} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <div>
          <span>{this.props.location.name}</span>
          <span className="controls">
            <a onClick={this.onEditLocation}><i className="fa fa-pencil"></i></a>
            <a onClick={this.moveLocationUp}><i className="fa fa-caret-up"></i></a>
            <a onClick={this.moveLocationDown}><i className="fa fa-caret-down"></i></a>
            <a onClick={this.onDeleteLocation}><i className="fa fa-times text-danger"></i></a>
          </span>
        </div>
        { this.props.location.comments &&
          <div className="text-muted">
            {this.props.location.comments}
          </div>
        }
        <Modal show={this.state.editing} onHide={this.closeModal}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit {this.props.location.name}</h2>
            </div>
            <div className="modal-body">
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label>Name:</label>
                  <input type="text" className="form-control" defaultValue={this.props.location.name} ref="locationNameInput"/>
                </div>
                <div className="form-group">
                  <label>Comments:</label>
                  <textarea className="form-control" defaultValue={this.props.location.comments} ref="locationCommentsInput"/>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-default" onClick={this.onEditLocationSave}>Submit</button>
            </div>
          </div>
        </Modal>
      </li>
    );
    return connectDragSource(component);
  }
}

GroupMember.propTypes = {
  location: React.PropTypes.object,
  // Injected by React DnD:
  isDragging: React.PropTypes.bool.isRequired,
  connectDragSource: React.PropTypes.func.isRequired
};
export default GroupMember;
