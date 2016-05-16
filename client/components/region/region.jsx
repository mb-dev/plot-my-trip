import React from 'react';
import dispatcher from '../../dispatcher/dispatcher';
import ActionType from '../../stores/action_types';
import store from '../../stores/store';

import Group from '../group/group';

require('./region.less');

export default class Region extends React.Component {
  static propTypes = {
    region: React.PropTypes.object,
    editable: React.PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.state = {scrapLocations: [], groups: [], activeLocation: null};

    this.onAddDay = this.onAddDay.bind(this);
    this.onTripsStoreChange = this.onTripsStoreChange.bind(this);
  }
  componentDidMount() {
    store.addChangeListener(this.onTripsStoreChange);
    this.onTripsStoreChange();
  }
  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }
  componentWillUnmount() {
    store.removeChangeListener(this.onTripsStoreChange);
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
      groups: store.currentTrip.getGroupsInRegion(props.region.id),
    });
  }
  render() {
    let groupNodes = this.state.groups.map((group) => (
      <Group key={group.id} group={group} region={this.props.region} editable={this.props.editable} />
    ));
    const scrapeGroup = {id: null, name: 'Scrape Book'};
    return (
      <div id="region">
        { this.props.editable &&
          <a href="#" onClick={this.onAddDay}><i className="fa fa-plus"></i> Add Day</a>
        }
        <div className="group-nodes">
          {groupNodes}
        </div>
        <Group group={scrapeGroup} region={this.props.region} editable={this.props.editable} />
      </div>
    );
  }
}
