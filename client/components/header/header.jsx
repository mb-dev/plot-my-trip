import React from 'react';
import {Link} from 'react-router';
import classNames from 'classnames';

import userStore  from '../../stores/users_store';
import tripsStore from '../../stores/trips_store';
import apiClient from '../../libraries/api_client/api_client';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentUser: null, saveSuccessfully: true};
    this.onUsersStoreChange = this.onUsersStoreChange.bind(this);
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
  }
  handleLogin() {
    // get Google Auth URL
    apiClient.getGoogleAuthUrl(result => {
      window.top.location.href = result;
    });
  }
  onSaveTrip() {
    tripsStore.save();
  }
  onUsersStoreChange() {
    this.setState({currentUser: userStore.getCurrentUser()});
  }
  onTripsStoreChange() {
    this.setState({saveSuccessfully: tripsStore.saveSuccessfully});
  }
  componentDidMount() {
    userStore.addChangeListener(this.onUsersStoreChange);
    tripsStore.addChangeListener(this.onTripsStoreChange);
  }
  componentWillUnmount() {
    userStore.removeChangeListener(this.onUsersStoreChange);
    tripsStore.removeChangeListener(this.onTripsStoreChange);
  }
  render() {
    var userSection;
    const saveButtonClass = classNames({
      'btn': true,
      'navbar-btn': true,
      'btn-primary': this.state.saveSuccessfully,
      'btn-danger': !this.state.saveSuccessfully
    });

    if (this.state.currentUser) {
      userSection = <div className="navbar-text">
        <span>Welcome {this.state.currentUser.name}</span>
        &nbsp;
        (<Link to="logout">Logout</Link>)
      </div>;
    } else {
      userSection = <a className="btn" onClick={this.handleLogin}>
        <i className="fa fa-google"></i> Login using Google
      </a>;
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
              <li className="active"><Link to="home">Home <span className="sr-only">(current)</span></Link></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                {userSection}
              </li>
              <li><button type="button" onClick={this.onSaveTrip} className={saveButtonClass}>Save</button></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
