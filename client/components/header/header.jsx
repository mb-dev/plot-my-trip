import React from 'react';
import {Link} from 'react-router';
import classNames from 'classnames';

import userStore  from '../../stores/users_store';
import store from '../../stores/store';
import actions from '../../actions/actions';
import apiClient from '../../libraries/api_client/api_client';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentUser: null, saveSuccessfully: true};
    this.onUsersStoreChange = this.onUsersStoreChange.bind(this);
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
    this.onSaveTrip = this.onSaveTrip.bind(this);
    this.onShareTrip = this.onShareTrip.bind(this);
  }
  handleLogin() {
    // get Google Auth URL
    apiClient.getGoogleAuthUrl(result => {
      window.top.location.href = result;
    });
  }
  onSaveTrip() {
    actions.saveTrip();
  }
  onUsersStoreChange() {
    this.setState({currentUser: userStore.getCurrentUser()});
  }
  onTripsStoreChange() {
    this.setState({saveSuccessfully: store.saveSuccessfully});
  }
  onShareTrip() {
  }
  componentDidMount() {
    userStore.addChangeListener(this.onUsersStoreChange);
    store.addChangeListener(this.onTripsStoreChange);
  }
  componentWillUnmount() {
    userStore.removeChangeListener(this.onUsersStoreChange);
    store.removeChangeListener(this.onTripsStoreChange);
  }
  render() {
    var userSection;
    const saveButtonClass = classNames({
      'btn': true,
      'navbar-btn': true,
      'btn-primary': this.state.saveSuccessfully,
      'btn-danger': !this.state.saveSuccessfully,
    });

    if (this.state.currentUser) {
      userSection = (<div className="navbar-text">
        <span>Welcome {this.state.currentUser.name}</span>
        &nbsp;
        (<Link to="/logout">Logout</Link>)
      </div>);
    } else {
      userSection = (<a className="btn" onClick={this.handleLogin}>
        <i className="fa fa-google"></i> Login using Google
      </a>);
    }

    const links = [
      {name: 'Home', link: '/', className: window.location.pathname.length <= 1 ? 'active' : ''},
    ];

    if (this.state.currentUser) {
      links.push({name: 'My Trips', link: '/trips', className: window.location.pathname.indexOf('/trips') >= 0 ? 'active' : ''});
    }

    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand" to="home">Plot My Trip</Link>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              {links.map((link) => (
                <li className={link.className} key={link.name}>
                  <Link to={link.link}>{link.name}</Link>
                </li>
              ))}
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                {userSection}
              </li>
              {this.state.currentUser && [
                <li key="share-trip"><button type="button" onClick={this.onShareTrip} className="btn navbar-btn">Share</button></li>,
                <li key="save-trip"><button type="button" onClick={this.onSaveTrip} className={saveButtonClass}>Save</button></li>,
              ]}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
