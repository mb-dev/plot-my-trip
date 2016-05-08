import React from 'react';
import dispatcher from '../../dispatcher/dispatcher';
import ActionType from '../../stores/action_types';
import tripsStore from '../../stores/trips_store';

import Group from '../group/group';

require('./region.less');

export default class Region extends React.Component {
  static propTypes = {
    region: React.PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {scrapLocations: [], groups: [], activeLocation: null};

    this.onAddDay = this.onAddDay.bind(this);
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
  }
  componentDidMount() {
    tripsStore.addChangeListener(this.onTripsStoreChange);
    this.onTripsStoreChange();
  }
  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }
  componentWillUnmount() {
    tripsStore.removeChangeListener(this.onTripsStoreChange);
  }
  onAddDay() {
    dispatcher.dispatch({actionType: ActionType.GROUPS.ADD_GROUP, regionId: this.props.region.id});
  }
  onTripsStoreChange() {
    this.updateState(this.props);
  }
  onSubmit(e) {
    e.preventDefault();
  }
  updateState(props) {
    this.setState({
      groups: tripsStore.currentTrip.getGroupsInRegion(props.region.id),
    });
  }
  render() {
    let groupNodes = this.state.groups.map((group) => (
      <Group key={group.id} group={group} region={this.props.region} />
    ));
    const scrapeGroup = {id: null, name: 'Scrape Book'};
    return (
      <div id="region">
        <a href="#" onClick={this.onAddDay}><i className="fa fa-plus"></i> Add Day</a>
        <div className="group-nodes">
          {groupNodes}
        </div>
        <Group group={scrapeGroup} region={this.props.region} />
      </div>
    );
  }
}
