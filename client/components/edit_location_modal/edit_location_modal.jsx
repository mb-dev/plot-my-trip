import React from 'react';
import Modal from '../modal/modal';

import actions from '../../actions/actions';

export default class EditLocationModal extends React.Component {
  static propTypes = {
    location: React.PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    this.onEditLocationSave = this.onEditLocationSave.bind(this);
  }
  onEditLocationSave(e) {
    e.preventDefault();
    const name = this.refs.locationNameInput.value;
    const comments = this.refs.locationCommentsInput.value;
    actions.editLocationOk(this.props.location.id, {name: name, comments: comments});
  }
  onEditLocationClosed() {
    actions.editLocationClosed();
  }

  render() {
    const title = <span>Edit {this.props.location.name}</span>;
    return (
      <Modal handleSaveModal={this.onEditLocationSave} handleHideModal={this.onEditLocationClosed} title={title}>
        <form onSubmit={this.onEditLocationSave}>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" className="form-control" defaultValue={this.props.location.name} ref="locationNameInput" />
          </div>
          <div className="form-group">
            <label>Comments:</label>
            <textarea className="form-control" defaultValue={this.props.location.comments} ref="locationCommentsInput" />
          </div>
        </form>
      </Modal>
    );
  }
}
