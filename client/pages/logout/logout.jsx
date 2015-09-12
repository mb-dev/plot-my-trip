import React from 'react';
import {Link} from 'react-router'

import userActions from '../../actions/user_actions'

export default class Logout extends React.Component {
  componentDidMount() {
    userActions.logout(this.context.router);
  }
  render() {
    return (
      <div id="page-content">
        Logging out...
      </div>
    )
  }
}

Logout.contextTypes = {
  router: React.PropTypes.func.isRequired
}
