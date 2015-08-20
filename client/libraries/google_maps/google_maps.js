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
    this.marker = new google.maps.Marker({draggable: true});
    this.markers = {};
  }
  createAutoComplete(inputDomNode) {
    this.autocomplete = new google.maps.places.Autocomplete(inputDomNode);
    this.autocomplete.bindTo('bounds', this.map);
    google.maps.event.addListener(this.autocomplete, 'place_changed', this.onPlaceChanged.bind(this));
  }
  findPlace(position) {
    this.marker.setPosition(position);
    this.marker.setMap(this.map);
    setTimeout(() => {
      this.map.panTo(position);
      // if (place.geometry.viewport) {
      //   this.map.fitBounds(place.geometry.viewport);
      // }
    }, 100);
  }
  clearPlace() {
    if (this.marker) {
      this.marker.setMap(null);
    }
  }
  addHandler(callback, handler) {
    this.handlers[callback] = handler;
  }
  displayLocations(locations) {
    let existingLocationIds = Object.keys(this.markers);
    let newLocationIds = locations.map(location => location.id);
    let markersToRemove = _.difference(existingLocationIds, newLocationIds);
    for (let locationId of markersToRemove) {
      this.markers[locationId].setMap(null);
      delete this.markers[locationId];
    }
    for (let location of locations) {
      if (!this.markers[location.id]) {
        let marker = this.markers[location.id] = new google.maps.Marker();
        marker.setPosition(location.position);
        marker.setMap(this.map);
      }
    }
  }
  onPlaceChanged() {
    if (this.handlers.onPlaceChanged) {
      this.handlers.onPlaceChanged(this.autocomplete.getPlace());
    }
  }
}
