import _ from 'lodash';

// white (#FFFFFF) - no group, gray (#6E6E6E)- focus
const COLORS = [
  {file: 'red', color: '#FF0000'},
  {file: 'blue', color: '#0080FF'},
  {file: 'purple', color: '#8000FF'},
  {file: 'yellow', color: '#FFFF00'},
  {file: 'green', color: '#04B404'},
  {file: 'brown', color: '#784600'},
  {file: 'pink', color: '#ffb8c2'},
  {file: 'dark-red', color: '#b31e3e'},
  {file: 'shiny-yellow', color: '#e5ff00'},
  {file: 'light-green', color: '#b4eeb4'},
];

const WHITE_COLOR = {file: 'white', color: 'white'};

export default class Trip {
  constructor(tripData) {
    this.reset();
    if (tripData) {
      this.data = tripData;
    }
  }
  getNextId() {
    const current = this.data.nextId;
    this.data.nextId += 1;
    return current;
  }
  reset() {
    this.data = {_id: null, regions: [], groups: [], locations: [], nextId: 1};
    this.activePlace = null;
    this.focusLocationId = null;
    this.activeRegion = null;
    this.activeGroup = null;
    this.colorByGroup = {};
  }
  getTripId() {
    return this.data._id || 'new';
  }
  getTripName() {
    return this.data.name;
  }
  setTripName(name) {
    this.data.name = name;
  }
  getActiveLocation() {
    return this.activePlace;
  }
  setActivePlace(place) {
    this.activePlace = place;
  }
  getFocusLocation() {
    return this.focusLocationId;
  }
  setFocusLocation(locationId) {
    this.focusLocationId = locationId;
  }
  addActivePlaceToTrip() {
    if (!this.activePlace) {
      return null;
    }
    const location = {
      id: this.getNextId(),
      name: this.activePlace.name,
      type: this.activePlace.types[0],
      googleData: this.activePlace,
    };
    this.data.locations.push(location);
    this.activePlace = null;
    return location;
  }
  editLocation(locationId, newData) {
    const location = this.getLocationById(locationId);
    location.name = newData.name;
    location.comments = newData.comments;
  }
  deleteLocation(locationId) {
    _.remove(this.data.locations, location => location.id === locationId);
    this.data.groups.forEach(group => _.remove(group.locations, (groupLocation) => groupLocation === locationId));
    this.data.regions.forEach(region => _.remove(region.scrapeLocations, (regionLocation) => regionLocation === locationId));
  }
  getLocationById(locationId) {
    return _.find(this.data.locations, {id: locationId});
  }
  getLocations() {
    return this.data.locations;
  }
  getUnassignedLocations() {
    return _.filter(this.data.locations, location => !location.groupId);
  }

  // groups
  getGroups() {
    return this.data.groups;
  }
  getGroupsInRegion(regionId) {
    return _.filter(this.data.groups, group => group.regionId === regionId);
  }
  getGroupById(groupId) {
    return _.find(this.data.groups, {id: groupId});
  }
  getActiveGroup() {
    return this.activeGroup;
  }
  addGroup(regionId, groupName) {
    const group = {
      id: this.getNextId(),
      name: groupName,
      regionId: regionId,
      locations: [],
    };
    this.data.groups.push(group);
    const region = this.getRegionById(regionId);
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
    let locations = _.filter(this.data.locations, (location) => location.groupId === groupId );
    let locationsById = _.indexBy(locations, 'id');
    let group = this.getGroupById(groupId);
    return group.locations.map(id => locationsById[id]);
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
    group.locations = _.union(group.locations, [locationId]);
    let region = this.getRegionById(group.regionId)
    this.removeLocationFromRegion(region, location);
  }
  removeLocationFromGroup(groupId, locationId) {
    let location = this.getLocationById(locationId);
    let group = this.getGroupById(groupId);
    location.groupId = null;
    group.locations = _.without(group.locations, locationId);
  }
  unassignLocation(locationId, regionId) {
    let location = this.getLocationById(locationId);
    if (!location.groupId) {
      return;
    }
    if (location.groupId) {
      this.removeLocationFromGroup(location.groupId, locationId);
    }
    this.addLocationToRegion(regionId, locationId);
  }
  moveLocationUp(locationId) {
    let location = this.getLocationById(locationId);
    let group = this.getGroupById(location.groupId);
    let currentIndex = group.locations.indexOf(locationId);
    if (currentIndex < 0) {
      return null;
    }
    group.locations.splice(currentIndex, 1);
    group.locations.splice(currentIndex-1, 0, locationId);
  }
  moveLocationDown(locationId) {
    let location = this.getLocationById(locationId);
    let group = this.getGroupById(location.groupId);
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
  getRegionByName(regionName) {
    return _.find(this.data.regions, {name: regionName});
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
      googleData: this.activePlace,
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
    let location = _.isNumber(locationId) ? this.getLocationById(locationId) : locationId;
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

    let locations = [];
    for (let key in groupsInRegion) {
      locations = locations.concat(this.getGroupMembers(groupsInRegion[key].id));
    }
    locations = locations.concat(this.getRegionScrapLocations(regionId));
    return locations;
  }
  getPrevRegion() {
    if (this.data.regions.length <= 1) {
      return null;
    }
    let currentIndex = this.data.regions.indexOf(this.activeRegion);
    if (currentIndex === 0) {
      return null;
    }
    return this.data.regions[currentIndex - 1];
  }
  getNextRegion() {
    if (this.data.regions.length <= 1) {
      return null;
    }
    let currentIndex = this.data.regions.indexOf(this.activeRegion);
    if (currentIndex === this.data.regions.length - 1) {
      return null;
    }
    return this.data.regions[currentIndex + 1];
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
    return WHITE_COLOR;
  }
}
