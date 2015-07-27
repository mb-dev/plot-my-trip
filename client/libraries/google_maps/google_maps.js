export default class GoogleMapsService {
  constructor() {

  }
  createMap(mapDomNode) {
    var mapOptions = {
      center: { lat: -34.397, lng: 150.644},
      zoom: 8
    };
    this.map = new google.maps.Map(mapDomNode, mapOptions);
  }
  createAutoComplete(inputDomNode) {
    this.autocomplete = new google.maps.places.Autocomplete(inputDomNode);
    this.autocomplete.bindTo('bounds', this.map);
    google.maps.event.addListener(this.autocomplete, 'place_changed', this.onPlaceChanged);
  }
  onPlaceChanged() {
    tripDispatcher.dispatch()
  }
}
