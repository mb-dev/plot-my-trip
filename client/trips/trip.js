import _ from 'lodash'

export default class Trip {
  constructor() {
    this.reset();
  }
  getNextId() {
    let current = this.data.nextId;
    this.data.nextId += 1;
    return current;
  }
  reset() {
    this.data = {groups: [], locations: [], nextId: 1};
    this.activePlace = null;
    this.activeGroup = null;
  }
  getActiveLocation() {
    return this.activePlace;
  }
  setActivePlace(place) {
    this.activePlace = place;
  }
  setActiveGroup(group) {
    this.activeGroup = group;
  }
  addActivePlaceToTrip() {
    if (!this.activePlace) {
      return;
    }
    let location = {
      id: this.getNextId(),
      name: this.activePlace.name,
      type: this.activePlace.types[0],
      googleData: this.activePlace
    };
    this.data.locations.push(location);
    this.activePlace = null;
    return location;
  }
  deleteLocation(locationId) {
    _.remove(this.data.locations, location => location.id === locationId);
    this.data.groups.forEach(group => _.remove(group.locations, _.matches(locationId)));
  }
  getLocationById(locationId) {
    return _.find(this.data.locations, {id: locationId});
  }
  getLocations() {
    return this.data.locations;
  }
  getUnassignedLocations() {
    return _.filter(this.data.locations, location => !location.groupId )
  }

  // groups
  getGroups() {
    return this.data.groups;
  }
  getGroupById(groupId) {
    return _.find(this.data.groups, {id: groupId});
  }
  addGroup(groupName) {
    let group = {
      id: this.getNextId(),
      name: groupName,
      locations: []
    };
    this.data.groups.push(group);
    return group;
  }
  deleteGroup(groupId) {
    _.remove(this.data.groups, (group) => group.id === groupId)
  }
  getGroupMembers(groupId) {
    return _.filter(this.data.locations, (location) => location.groupId === groupId );
  }
  addLocationToGroup(groupId, locationId) {
    let location = this.getLocationById(locationId);
    let group = this.getGroupById(groupId);
    if (location.groupId === groupId) {
      return;
    }
    if (location.groupId) {
      this.removeLocationFromGroup(location.groupId, locationId);
    }
    location.groupId = groupId;
    group.locations.push(locationId);
  }
  removeLocationFromGroup(groupId, locationId) {
    let location = this.getLocationById(locationId);
    let group = this.getGroupById(groupId);
    location.groupId = null;
    group.locations = _.without(group.locations, locationId);
  }
  moveLocationUp(groupId, locationId) {
    let group = this.getGroupById(groupId);
    let currentIndex = group.locations.indexOf(locationId);
    if (currentIndex < 0) {
      return null;
    }
    group.locations.splice(currentIndex, 1);
    group.locations.splice(currentIndex-1, 0, locationId);
  }
  moveLocationDown(groupId, locationId) {
    let group = this.getGroupById(groupId);
    let currentIndex = group.locations.indexOf(locationId);
    if (currentIndex < 0) {
      return null;
    }
    group.locations.splice(currentIndex, 1);
    group.locations.splice(currentIndex+1, 0, locationId);
  }
}
