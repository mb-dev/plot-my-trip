import React, { PropTypes } from 'react';
import dispatcher from '../../dispatcher/dispatcher'
import ActionType from '../../trips/action_types'
import tripsStore from '../../trips/trips_store'

class MousetrapMixin {
  constructor() {
    this.mousetrapBindings = [];
  }
  bindShortcut(key, callback) {
      Mousetrap.bind(key, callback);

      this.mousetrapBindings.push(key);
  }
  unbindShortcut(key) {
      var index = this.mousetrapBindings.indexOf(key);

      if (index > -1) {
          this.mousetrapBindings.splice(index, 1);
      }

      Mousetrap.unbind(binding);
  }
  unbindAllShortcuts() {
      if (this.mousetrapBindings.length < 1) {
          return;
      }

      this.mousetrapBindings.forEach(function (binding) {
          Mousetrap.unbind(binding);
      });
  }
}

class OptionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {locations: []};
    this.mouseTrap = new MousetrapMixin();
  }
  onKeyUp(e) {
    this.setState({selectedIndex: this.state.selectedIndex - 1});
  }
  onKeyDown(e) {
    this.setState({selectedIndex: this.state.selectedIndex + 1});
  }
  addPlace() {
    dispatcher.dispatch({actionType: ActionType.ADD_LOCATION});
  }
  onTripsStoreChange() {
    this.setState({locations: tripsStore.getLocations()});
  }
  componentDidMount() {
    this.mouseTrap.bindShortcut('up', this.onKeyUp);
    this.mouseTrap.bindShortcut('down', this.onKeyDown);
    tripsStore.addChangeListener(this.onTripsStoreChange.bind(this));
  }
  componentWillUnmount() {
    this.mouseTrap.unbindAllShortcuts();
    tripsStore.removeChangeListener(this.onTripsStoreChange.bind(this));
  }
  render() {
    var selectedIndex = this.state.selectedIndex;
    var optionNodes = this.state.locations.map(function(option, index) {
      var className = index == selectedIndex ? 'selected' : '';
      return (<li className={className}>{option.name}</li>);
    });
    return (
      <div>
        <a href="#" onClick={this.addPlace}>Add</a>
        <ul>
          {optionNodes}
        </ul>
      </div>
    );
  }
}

OptionList.defaultProps = {selectedIndex: 0};

export default OptionList;
