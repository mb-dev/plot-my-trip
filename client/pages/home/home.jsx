import React from 'react';

import tripActions from '../../actions/trip_actions'
import CitySelector from '../../components/city_selector/city_selector';
import tripsStore from '../../stores/trips_store'

export default class HomePage extends React.Component {
  constructor(props, context) {
    this.onCreateTrip = this.onCreateTrip.bind(this);
    this.state = {city: null, trips: []};
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
    this.onSelectCity = this.onSelectCity.bind(this);
  }
  componentWillMount() {
    this.updateState(this.props);
  }
  componentDidMount() {
    tripsStore.addChangeListener(this.onTripsStoreChange);
  }
  componentWillUnmount() {
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
  onCreateTrip() {
    tripActions.createTrip(this.state.city, this.context.router);
  }
  onSelectCity(city) {
    this.setState({
      city: city
    });
  }
  onSubmit(e) {
    e.preventDefault();
  }
  render() {
    let validPlace = this.state.currentPlace && this.state.currentPlace !== 'invalid';
    return (
      <div className="home-page">
        <div className="create-trip container">
          <h2>Getting Started:</h2>
          <form className="text-center" onSubmit={this.onSubmit}>
            <div className="which-city">To which city would you like to travel today?</div>
            <CitySelector onSelectCity={this.onSelectCity} />
            <button className="btn btn-primary" type="primary" onClick={this.onCreateTrip} disabled={!validPlace}>
              Create Trip
            </button>
          </form>
        </div>

        <div className="existing-trips container">
          <h2>Existing Trips:</h2>
          <ul>
            {this.state.trips.map((trip) => (
              <li key={trip.id}><Link to="edit" params={{tripId: (trip.id || 'new')}}>{trip.name || 'Untitled'} ({trip.regionsCount}) </Link></li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

HomePage.contextTypes = {
  router: React.PropTypes.func.isRequired
}
