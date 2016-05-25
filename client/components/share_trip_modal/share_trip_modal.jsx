import React from 'react';
import Modal from '../modal/modal';

import actions from '../../actions/actions';

export default class ShareTripModal extends React.Component {
  static propTypes = {
    trip: React.PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.onShareTripSave = this.onShareTripSave.bind(this);
    this.state = {emails: [], public: false};
    this.onAddShare = this.onAddShare.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
  }
  async componentDidMount() {
    const shareSettings = await actions.getShareSettings(this.props.trip._id);
    this.setState(shareSettings);
  }
  onShareTripSave(e) {
    e.preventDefault();
  }
  onAddShare(e) {
    e.preventDefault();
    this.setState({
      emails: this.state.emails.concat(this.refs.newEmail.value),
    });
  }
  onEditLocationClosed() {
    actions.editLocationClosed();
  }

  render() {
    const title = <span>Share {this.props.trip.name}</span>;
    return (
      <Modal handleSaveModal={this.onShareTripSave} handleHideModal={this.onEditLocationClosed} title={title}>
        <h2>Share with group of people:</h2>
        <ul>
          {this.state.emails.map((email) => (
            <li>
              <span>{email}</span>
              <a href="#" onClick={this.onClickRemove}>Remove</a>
            </li>
          ))}
        </ul>
        <form onSubmit={this.onShareTripSave}>
          <div className="form-group">
            <label>Email:</label>
            <input type="text" className="form-control" ref="newEmail" />
          </div>
          <button type="button" onClick={this.onAddShare}>Add Share</button>
        </form>
        <h2>Make Public:</h2>
        <input type="checkbox" defaultChecked={this.state.public} onChange={(e) => this.setState({public: e.target.value})} />
      </Modal>
    );
  }
}

