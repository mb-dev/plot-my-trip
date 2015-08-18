import React from 'react';
import classNames from 'classNames'

import userStore  from '../../users/users_store'
import tripsStore from '../../trips/trips_store'

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentUser: null, saveSuccessfully: true};
    this.onUsersStoreChange = this.onUsersStoreChange.bind(this);
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
  }
  handleLogin() {
    // get Google Auth URL
    $.get('/api/auth/google', function(result) {
      window.location.href = result;
    })
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
  render() {
    var userSection;
    const saveButtonClass = classNames({
      'btn': true,
      'btn-primary': this.state.saveSuccessfully,
      'btn-danger': !this.state.saveSuccessfully
    });

    if (this.state.currentUser) {
      userSection = <div className="navbar-text">
        <span>Welcome {this.state.currentUser.name}</span>
        <a href="#" onClick={this.onSaveTrip} className={saveButtonClass}>Save</a>
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
            <a className="navbar-brand" href="#">Plot My Trip</a>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li className="active"><a href="#">Home <span className="sr-only">(current)</span></a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                {userSection}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
