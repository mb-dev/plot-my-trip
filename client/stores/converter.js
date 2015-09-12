export default {
  // Convert from Google Maps location to internal representation
  placeToLocation: function(place) {
    let country = '';
    let city = '';

    place.address_components.forEach(function(component, index) {
      if(component.types.indexOf('country') >= 0) {
        country = component.long_name;
      } else if(index > 0 && component.types.indexOf('locality') >= 0) {
        city = component.long_name;
      }
    });

    let location = place.geometry.location;

    let data = {
      types: place.types,
      place_id: place.place_id,
      name: place.name,
      position: {lat: location.lat(), lng: location.lng()},
      country: country,
      city: city
    };

    if (place.geometry.viewport) {
      let northeast = place.geometry.viewport.getNorthEast();
      let southwest = place.geometry.viewport.getSouthWest();
      data.viewport = {sw: {lat: southwest.lat(), lng: southwest.lng()}, ne: {lat: northeast.lat(), lng: northeast.lng()}};
    }

    return data;
  }
}
