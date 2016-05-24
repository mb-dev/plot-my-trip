import React from 'react';
import actions from '../../actions/actions';

export default class GoogleCallback extends React.Component {
  componentDidMount() {
    const {state, code} = this.props.location.query;

    if (state && code) {
      actions.login(state, code);
    }
  }
  render() {
    return (
      <div id="page-content">
        Logging in...
      </div>
    );
  }
}

GoogleCallback.contextTypes = {
  router: React.PropTypes.func.isRequired
}
