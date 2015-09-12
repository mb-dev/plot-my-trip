import _ from 'lodash'

const COLORS = ['red', 'blue', 'purple', 'yellow'];

export default class Trip {
  constructor(tripData) {
    this.reset();
    if(tripData) {
      this.data = tripData;
    }
  }
  getNextId() {
    let current = this.data.nextId;
    this.data.nextId += 1;
    return current;
  }
  reset() {
    this.data = {_id: 'new', regions: [], groups: [], locations: [], nextId: 1};
    this.activePlace = null;
    this.activeRegion = null;
    this.activeGroup = null;
    this.colorByGroup = {};
  }
  getTripId() {
    return this.data._id;
  }
  getTripName() {
    return this.data.name;
  }
  getActiveLocation() {
    return this.activePlace;
  }
  setActivePlace(place) {
    this.activePlace = place;
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
    this.data.groups.forEach(group => _.remove(group.locations,  (groupLocation) => groupLocation === locationId ));
    this.data.regions.forEach(region => _.remove(region.scrapeLocations, (regionLocation) => regionLocation === locationId ));
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
  getGroupsInRegion(regionId) {
    return _.filter(this.data.groups, group => group.regionId === regionId )
  }
  getGroupById(groupId) {
    return _.find(this.data.groups, {id: groupId});
  }
  getActiveGroup() {
    return this.activeGroup;
  }
  addGroup(regionId, groupName) {
    let group = {
      id: this.getNextId(),
      name: groupName,
      regionId: regionId,
      locations: []
    };
    this.data.groups.push(group);
    let region = this.getRegionById(regionId);
    region.groups.push(group.id);
    return group;
  }
  deleteGroup(groupId) {
    let group = this.getGroupById(groupId);
    // remove group from locations
    for (let location of this.data.locations) {
      if (location.groupId == groupId) {
        location.groupId = null;
      }
    }
    // remove group from region
    if (group.regionId) {
      this.removeGroupFromRegion(group.regionId, groupId);
    }
    // remove group
    _.remove(this.data.groups, (group) => group.id === groupId);
  }
  getGroupMembers(groupId) {
    return _.filter(this.data.locations, (location) => location.groupId === groupId );
  }
  addLocationToGroup(groupId, locationId) {
    let location = this.getLocationById(locationId);
    let group = this.getGroupById(groupId);
    let region = this.getRegionById(group.regionId)
    if (location.groupId === groupId) {
      return;
    }
    if (location.groupId) {
      this.removeLocationFromGroup(location.groupId, locationId);
    }
    location.groupId = groupId;
    group.locations = _.union(group.locations, [locationId]);
    this.removeLocationFromRegion(region, location);
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
  selectGroup(groupId) {
    this.activeGroup = this.getGroupById(groupId);
  }

  // regions
  getActiveRegion() {
    return this.activeRegion;
  }
  getRegionCount() {
    return this.data.regions.length;
  }
  setActiveRegion(regionId) {
    let region = _.isNumber(regionId) ? this.getRegionById(regionId) : regionId;

    this.activeRegion = region;
    this.activeGroup = null;
    this.activePlace = null;
  }
  getRegionById(regionId) {
    return _.find(this.data.regions, {id: regionId});
  }
  getRegions() {
    return this.data.regions;
  }
  addActivePlaceAsRegion() {
    let region = {
      id: this.getNextId(),
      name: this.activePlace.name,
      groups: [],
      scrapeLocations: [],
      googleData: this.activePlace
    };
    this.data.regions.push(region);
    return region;
  }
  removeGroupFromRegion(regionId, groupId) {
    let region = this.getRegionById(regionId);
    region.groups = _.without(region.groups, groupId);
  }
  addLocationToRegion(regionId, locationId) {
    let region = this.getRegionById(regionId);
    region.scrapeLocations.push(locationId);
  }
  removeLocationFromRegion(regionId, locationId) {
    let region = _.isNumber(regionId) ? this.getRegionById(regionId) : regionId;
    let location = _.isNumber(locationId) ? this.getLocationById(regionId) : locationId;
    region.scrapeLocations = _.without(region.scrapeLocations, location.id);
  }
  getRegionScrapLocations(regionId) {
    let region = this.getRegionById(regionId);
    return _.filter(this.data.locations, (location) => region.scrapeLocations.indexOf(location.id) >= 0);
  }
  getLocationsInRegion(regionId) {
    let region = this.getRegionById(regionId);
    let groupsInRegion = _.indexBy(this.getGroupsInRegion(regionId), 'id');
    let scrapeLocationIds = _.object(region.scrapeLocations, _.identity);

    return _.filter(this.data.locations, location => groupsInRegion[location.groupId] || _.has(scrapeLocationIds, location.id) );
  }
  selectPrevRegion() {
    if (this.data.regions.length <= 1) {
      return;
    }
    let currentIndex = this.data.regions.indexOf(this.activeRegion);
    if (currentIndex === 0) {
      return;
    }
    this.activeRegion = this.data.regions[currentIndex - 1];
    this.activeGroup = null;
  }
  selectNextRegion() {
    if (this.data.regions.length <= 1) {
      return;
    }
    let currentIndex = this.data.regions.indexOf(this.activeRegion);
    if (currentIndex === this.data.regions.length - 1) {
      return;
    }
    this.activeRegion = this.data.regions[currentIndex + 1];
    this.activeGroup = null;
  }

  // other - ui state
  assignColorByGroup() {
    this.colorByGroup = {};
    for(let i = 0; i < this.data.groups.length; ++i) {
      let group = this.data.groups[i];
      this.colorByGroup[group.id] = COLORS[i % COLORS.length];
    }
  }
  getColorOfGroup(groupId) {
    if (groupId) {
      return this.colorByGroup[groupId];
    }
    return 'green';
  }
}
