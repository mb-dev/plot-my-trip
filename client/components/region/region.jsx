import React from 'react';
import dispatcher from '../../dispatcher/dispatcher'
import ActionType from '../../stores/action_types'
import tripsStore from '../../stores/trips_store'
import MousetrapMixin from '../../libraries/mousetrap_mixin/mousetrap_mixin'

import Group from '../group/group'
import GroupMember from '../group/group_member'

require('./region.less');

export default class Region extends React.Component {
  constructor(props) {
    super(props);
    this.state = {scrapLocations: [], groups: [], activeLocation: null};
    this.mouseTrap = new MousetrapMixin();

    this.addPlace = this.addPlace.bind(this);
    this.addDay = this.addDay.bind(this);
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
  }
  onKeyUp(e) {
    this.setState({selectedIndex: this.state.selectedIndex - 1});
  }
  onKeyDown(e) {
    this.setState({selectedIndex: this.state.selectedIndex + 1});
  }
  addPlace() {
    dispatcher.dispatch({actionType: ActionType.LOCATIONS.ADD_LOCATION, regionId: this.props.region.id});
  }
  addDay() {
    dispatcher.dispatch({actionType: ActionType.GROUPS.ADD_GROUP, regionId: this.props.region.id});
  }
  onTripsStoreChange() {
    this.updateState(this.props);

  }
  updateState(props) {
    this.setState({
      groups: tripsStore.currentTrip.getGroupsInRegion(props.region.id)
    });
  }
  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }
  componentDidMount() {
    tripsStore.addChangeListener(this.onTripsStoreChange);
    this.onTripsStoreChange();
  }
  componentWillUnmount() {
    tripsStore.removeChangeListener(this.onTripsStoreChange);
  }
  onSubmit() {
    return false;
  }
  render() {
    let selectedIndex = this.state.selectedIndex;
    let groupNodes = this.state.groups.map((group, index) => {
      var className = '';
      return (<Group key={group.id} group={group} region={this.props.region} />);
    });
    const scrapeGroup = {id: null, name: 'Scrape Book'};
    return (
      <div id="region">
        <a href="#" onClick={this.addDay}><i className="fa fa-plus"></i> Add Day</a>
        <div className="group-nodes">
          {groupNodes}
        </div>
        <Group group={scrapeGroup} region={this.props.region}/>
      </div>
    );
  }
}

Region.propTypes = {
  region: React.PropTypes.object,
};
