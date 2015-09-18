import React from 'react';
import {Link} from 'react-router'

import userActions from '../../actions/user_actions'

export default class Logout extends React.Component {
  componentDidMount() {
    let {state, code} = this.props.query;

    if(state && code) {
      userActions.login(state, code, this.context.router);
    }
  }
  render() {
    return (
      <div id="page-content">
        Logging in...
      </div>
    )
  }
}

Logout.contextTypes = {
  router: React.PropTypes.func.isRequired
}
