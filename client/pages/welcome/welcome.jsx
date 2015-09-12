import React from 'react';
import {Link} from 'react-router';

import tripsStore from '../../stores/trips_store'
import tripActions from '../../actions/trip_actions'

import dispatcher from '../../dispatcher/dispatcher'
import GoogleMapsService from '../../libraries/google_maps/google_maps';
import converter from '../../stores/converter'

require('./welcome.less');

export default class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentPlace: null, trips: []};
    this.onCreateTrip = this.onCreateTrip.bind(this);
    this.googleMapsService = new GoogleMapsService();
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
  }
  componentWillMount() {
    this.setStoreState();
    this.updateState(this.props);
  }
  componentDidMount() {
    this.googleMapsService.createAutoComplete(this.refs.autoComplete.getDOMNode());
    this.googleMapsService.addHandler('onPlaceChanged', (place) => {
      let googleData = converter.placeToLocation(place);
      if (googleData.types[0] === 'locality') {
        this.setState({currentPlace: googleData});
      } else {
        this.setState({currentPlace: 'invalid'});
      }
    });
    tripsStore.addChangeListener(this.onTripsStoreChange);
  }
  componentWillUnmount() {
    this.googleMapsService.clearHandlers();
    tripsStore.removeChangeListener(this.onTripsStoreChange);
  }
  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }
  updateState(props) {
    this.setState({
      trips: tripsStore.getTripsSummary()
    });
  }
  setStoreState() {
    tripsStore.setActiveTrip(null);
  }
  onCreateTrip() {
    tripActions.createTrip(this.state.currentPlace, this.context.router);
  }
  onTripsStoreChange() {
    this.updateState(this.props);
  }
  onSubmit() {
    return false;
  }
  render() {
    let tripsNodes = this.state.trips.map(function(trip) {
      return (<li key={trip.id}><Link to="edit" params={{tripId: trip.id}}>{trip.name || 'Untitled'} ({trip.regionsCount}) </Link></li>);
    });
    let validPlace = this.state.currentPlace && this.state.currentPlace !== 'invalid';
    return (
      <div id="page-content" className="container">

        <div className="existing-trips">
          <h2>Existing Trips:</h2>
          <ul>
            {tripsNodes}
          </ul>
        </div>
        <div className="create-trip">
          <h2>Create a new trip</h2>
          <form className="text-center" onSubmit={this.onSubmit}>
            <div className="which-city">To which city would you like to travel today?</div>
            <input className="form-control" id="autocomplete" ref="autoComplete" type="text"/>
            {
              this.state.currentPlace === 'invalid' &&
              <div className="text-danger text-left">Please enter a valid city</div>
            }
            <button className="btn btn-primary" type="primary" onClick={this.onCreateTrip} disabled={!validPlace}>
              Create Trip
            </button>
          </form>
        </div>
      </div>
    )
  }
}

Welcome.contextTypes = {
  router: React.PropTypes.func.isRequired
}
