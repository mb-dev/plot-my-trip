import React, {PropTypes} from 'react';
import config from '../../config/config';

const SELECTED_COLOR = 'gray';

export default class Location extends React.Component {
  constructor() {
    super();
    this.state = {marker: null};
  }
  componentWillMount() {
    this.setState({
      marker: new google.maps.Marker({draggable: true}),
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
      let image = new google.maps.MarkerImage(config.iconServer + 'icons/' + SELECTED_COLOR + '-pin.png');
      this.state.marker.setIcon(image);
    } else {
      let image = new google.maps.MarkerImage(config.iconServer + 'icons/' + this.props.color.file + '-pin.png');
      this.state.marker.setIcon(image);
    }
    return <div />;
  }
}

