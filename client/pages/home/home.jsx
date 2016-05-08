import React from 'react';
import {Link} from 'react-router';

import actions from '../../actions/actions';
import CitySelector from '../../components/city_selector/city_selector';
import tripsStore from '../../stores/trips_store';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.onCreateTrip = this.onCreateTrip.bind(this);
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
    this.onSelectCity = this.onSelectCity.bind(this);
    this.state = {
      city: null,
      trips: [],
    };
  }
  componentWillMount() {
    this.updateState(this.props);
  }
  componentDidMount() {
    tripsStore.addChangeListener(this.onTripsStoreChange);
  }
  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }
  componentWillUnmount() {
    tripsStore.removeChangeListener(this.onTripsStoreChange);
  }
  onCreateTrip() {
    actions.createTrip(this.state.city);
  }
  onTripsStoreChange() {
    this.updateState(this.props);
  }
  onSelectCity(city) {
    this.setState({
      city: city,
    });
  }
  onSubmit(e) {
    e.preventDefault();
  }
  updateState() {
    this.setState({
      trips: tripsStore.getTripsSummary(),
    });
  }
  render() {
    const validPlace = this.state.city && this.state.city !== 'invalid';
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
              <li key={trip.id}><Link to={`/trip/${trip.id}`}>{trip.name || 'Untitled'} ({trip.regionsCount}) </Link></li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
