import React from 'react';

import store from '../../stores/store';
import actions from '../../actions/actions';

import SideBar            from '../../components/side_bar/side_bar';
import MapArea            from '../../components/map_area/map_area';
import EditLocationModal  from '../../components/edit_location_modal/edit_location_modal';

require('./edit_trip.less');

export default class EditTrip extends React.Component {
  static propTypes = {
    location: React.PropTypes.object,
    params: React.PropTypes.object,
  }
  constructor(props, context) {
    super(props, context);

    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
    this.state = {editingLocation: null};
  }
  componentWillMount() {
    this.setStoreState(this.props);
  }
  componentDidMount() {
    store.addChangeListener(this.onTripsStoreChange);
    document.body.classList.add('edit-page');
  }
  componentWillReceiveProps(props) {
    this.setStoreState(props);
  }
  componentWillUnmount() {
    store.removeChangeListener(this.onTripsStoreChange);
    document.body.classList.remove('edit-page');
  }
  onTripsStoreChange() {
    this.setState({
      editingLocation: store.state.editingLocation,
      trip: store.currentTrip,
      editable: store.state.viewTrip.editable,
    });
  }
  setStoreState(props) {
    const editable = props.location.query.view !== '1';
    actions.viewTrip(props.params.tripId, props.params.regionName, editable);
  }
  render() {
    return (
      <div id="page-content" className="edit-trip">
        <SideBar trip={this.state.trip} editable={this.state.editable} />
        <MapArea editable={this.state.editable} />
        { this.state.editingLocation &&
          <EditLocationModal location={this.state.editingLocation} />
        }
      </div>
    );
  }
}
