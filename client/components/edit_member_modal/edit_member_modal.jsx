import React from 'react';
import Modal from '../modal/modal';

import actions from '../../actions/actions';

export default class EditMemberModal extends React.Component {
  static propTypes = {
    location: React.PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    this.onEditLocationSave = this.onEditLocationSave.bind(this);
  }
  onEditLocationSave(e) {
    const nameNode = this.refs.locationNameInput;
    const commentsNode = this.refs.locationCommentsInput;
    actions.modifyLocation(this.props.location.id, {name: nameNode.value, comments: commentsNode.value});
    this.setState({editing: false});
  }
  render() {
    const title = <span>Edit {this.props.location.name}</span>;
    return (
      <Modal onHide={this.closeModal} title={title}>
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
      </Modal>
    );
  }
}
