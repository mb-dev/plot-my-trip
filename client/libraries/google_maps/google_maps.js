function placeToPoint(place) {
  return {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
}

export default class GoogleMapsService {
  constructor() {
    this.handlers = {};
  }
  createMap(mapDomNode) {
    var mapOptions = {
      center: { lat: -34.397, lng: 150.644},
      zoom: 8
    };
    this.map = new google.maps.Map(mapDomNode, mapOptions);
    this.marker = new google.maps.Marker({draggable: true})
  }
  createAutoComplete(inputDomNode) {
    this.autocomplete = new google.maps.places.Autocomplete(inputDomNode);
    this.autocomplete.bindTo('bounds', this.map);
    google.maps.event.addListener(this.autocomplete, 'place_changed', this.onPlaceChanged.bind(this));
  }
  findPlace(place) {
    let point = placeToPoint(place);
    this.marker.setPosition(place.geometry.location);
    this.marker.setMap(this.map);
    setTimeout(() => {
      this.map.panTo(place.geometry.location);
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      }
    }, 100);
  }
  addHandler(callback, handler) {
    this.handlers[callback] = handler;
  }
  onPlaceChanged() {
    if (this.handlers.onPlaceChanged) {
      this.handlers.onPlaceChanged(this.autocomplete.getPlace());
    }
  }
}
