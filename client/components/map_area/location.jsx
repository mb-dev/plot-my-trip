import React from 'react';
import config from '../../config/config';

const SELECTED_COLOR = 'gray';

export default class Location extends React.Component {
  static propTypes = {
    focused: React.PropTypes.bool,
    locationKey: React.PropTypes.string,
    mapsService: React.PropTypes.object,
    color: React.PropTypes.object,
    index: React.PropTypes.string,
    position: React.PropTypes.object,
  }
  constructor() {
    super();
    this.state = {marker: null};
  }
  componentWillMount() {
    this.setState({
      marker: new google.maps.Marker(),
    });
  }
  componentDidMount() {
    this.state.marker.setMap(this.props.mapsService.map);
    this.state.marker.setPosition(this.props.position);
  }
  shouldComponentUpdate(nextProps) {
    return this.props.locationKey !== nextProps.locationKey;
  }
  componentWillUnmount() {
    this.state.marker.setMap(null);
  }
  updateState(props) {

  }
  render() {
    this.state.marker.setLabel(this.props.index && this.props.index.toString());
    if (this.props.focused) {
      const image = new google.maps.MarkerImage(config.iconServer + 'icons/' + SELECTED_COLOR + '-pin.png');
      this.state.marker.setIcon(image);
    } else {
      const image = new google.maps.MarkerImage(config.iconServer + 'icons/' + this.props.color.file + '-pin.png');
      this.state.marker.setIcon(image);
    }
    return <div />;
  }
}

