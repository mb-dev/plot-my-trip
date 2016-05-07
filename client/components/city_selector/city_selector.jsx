import React from 'react';

import GoogleMapsService from '../../libraries/google_maps/google_maps';
import converter from '../../stores/converter'

export default class CitySelector extends React.Component {
  constructor(props, context) {
    this.googleMapsService = new GoogleMapsService();
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
  }
  componentDidMount() {
    this.googleMapsService.createAutoComplete(this.refs.autoComplete.getDOMNode());
    this.googleMapsService.addHandler('onPlaceChanged', this.onPlaceChanged);
  }
  componentWillUnmount() {
    this.googleMapsService.clearHandlers();
  }
  onPlaceChanged(place) {
    let googleData = converter.placeToLocation(place);
    if (googleData.types[0] === 'locality') {
      this.setState({currentPlace: googleData});
      this.props.onSelectCity(googleData);
    } else {
      this.setState({currentPlace: 'invalid'});
      this.props.onSelectCity(null);
    }
  }
  render() {
    return (
      <div className="city-selector">
        <input className="form-control" id="autocomplete" ref="autoComplete" type="text"/>
        { this.state.currentPlace === 'invalid' &&
          <div className="text-danger text-left">Please enter a valid city</div>
        }
      </div>
    );
  }
}
