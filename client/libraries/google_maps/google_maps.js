import config from '../../config/config';

function placeToPoint(place) {
  return {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
}

let SELECTED_COLOR = 'gray';

export default class GoogleMapsService {
  constructor() {
    this.handlers = {};
  }
  createMap(mapDomNode) {
    var mapOptions = {
      center: { lat: -34.397, lng: 150.644},
      zoom: 8,
    };
    if (window.google) {
      this.map = new google.maps.Map(mapDomNode, mapOptions);
      this.marker = new google.maps.Marker({draggable: true});
      this.markers = {};
      this.currentState = {};
      this.currentCenter = null;
      this.currentViewport = null;
      this.previousFocusIcon = null;
      this.currentFocusLocationId = null;
      this.directionsDisplay = new google.maps.DirectionsRenderer();
      this.directionsService = new google.maps.DirectionsService();
    }
  }
  createAutoComplete(inputDomNode) {
    if (window.google) {
      this.autocomplete = new google.maps.places.Autocomplete(inputDomNode);
      if(this.map) {
        this.autocomplete.bindTo('bounds', this.map);
      }
      google.maps.event.addListener(this.autocomplete, 'place_changed', this.onPlaceChanged.bind(this));
    }
  }
  findPlace(position, viewport) {
    if (window.google) {
      this.marker.setPosition(position);
      this.marker.setMap(this.map);
      setTimeout(() => {
        this.map.panTo(position);
        if (viewport) {
          this.map.fitBounds(new google.maps.LatLngBounds(
            new google.maps.LatLng(viewport.sw.lat, viewport.sw.lng),
            new google.maps.LatLng(viewport.ne.lat, viewport.ne.lng)
          ));
        }
      }, 100);
    }
  }
  clearPlace() {
    if (this.marker) {
      this.marker.setMap(null);
    }
  }
  setState(state) {
    if (window.google) {
      if (!_.isEqual(state.center, this.currentState.center) || !_.isEqual(state.viewport, this.currentState.viewport)) {
        this.map.setCenter(new google.maps.LatLng(state.center.lat, state.center.lng));
        this.map.fitBounds(new google.maps.LatLngBounds(
          new google.maps.LatLng(state.viewport.sw.lat, state.viewport.sw.lng),
          new google.maps.LatLng(state.viewport.ne.lat, state.viewport.ne.lng)
        ));
      }

      if (state.activeLocation) {
        this.findPlace(state.activeLocation.position, state.activeLocation.viewport);
      } else {
        this.clearPlace();
      }

      if (!state.activeLocation && state.activeRegion) {
        this.setCenterAndBounds(state.activeRegion.googleData.position, state.activeRegion.googleData.viewport);
      }

      this.currentState = state;
    }
  }
  setCenterAndBounds(center, viewport) {
    if (window.google) {
      if (_.isEqual(center, this.currentCenter) && _.isEqual(viewport, this.currentViewport)) {
        return;
      }
      this.map.setCenter(new google.maps.LatLng(center.lat, center.lng));
      this.map.fitBounds(new google.maps.LatLngBounds(
        new google.maps.LatLng(viewport.sw.lat, viewport.sw.lng),
        new google.maps.LatLng(viewport.ne.lat, viewport.ne.lng)
      ));
      this.currentCenter = center;
      this.currentViewport = viewport;
    }
  }
  addHandler(callback, handler) {
    this.handlers[callback] = handler;
  }
  clearHandlers() {
    this.handlers = [];
  }
  locationToHashKey(location) {
    return location.id.toString() + '-' + location.color.file + '-' + location.index.toString() + '-' + location.focused;
  }
  markerUrl() {

  }
  displayDirections(locations) {
    if (window.google) {
      this.directionsDisplay.setMap(this.map);
      this.currentViewport = null;
      let points = locations.map(location => location.position);
      let length = points.length;
      let start = points[0];
      let end = points[length-1];
      let request = {
        origin: new google.maps.LatLng(start.lat, start.lng),
        destination: new google.maps.LatLng(end.lat, end.lng),
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      };
      if (length > 2) {
        request.waypoints = []
        for (let i = 1; i < points.length - 2; ++i) {
          request.waypoints.push({location: new google.maps.LatLng(waypoint.lat, waypoint.lng)});
        }
      }
      this.directionsService.route(request, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsDisplay.setDirections(response)
        }
      });
    }
  }
  onPlaceChanged() {
    if (this.handlers.onPlaceChanged) {
      this.handlers.onPlaceChanged(this.autocomplete.getPlace());
    }
  }
}
