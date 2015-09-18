var ActionType = {
  TRIPS: {
    CREATE_TRIP: 'CREATE_TRIP'
  },
  LOCATIONS: {
    ADD_LOCATION: 'ADD_LOCATION',
    EDIT_LOCATION: 'EDIT_LOCATION',
    DELETE_LOCATION: 'DELETE_LOCATION',
    PLACE_CHANGED: 'PLACE_CHANGED',
    'FOCUS_LOCATION': 'FOCUS_LOCATION'
  },
  GROUPS: {
    ADD_GROUP: 'ADD_GROUP',
    DELETE_GROUP: 'DELETE_GROUP',
    SELECT_GROUP: 'SELECT_GROUP',
    ADD_PLACE_TO_GROUP: 'ADD_PLACE_TO_GROUP',
    REMOVE_PLACE_FROM_GROUP: 'REMOVE_PLACE_FROM_GROUP'
  },
  REGIONS: {
    ADD_REGION: 'ADD_REGION',
    DELETE_REGION: 'DELETE_REGION',
    SELECT_PREV_REGION: 'SELECT_PREV_REGION',
    SELECT_NEXT_REGION: 'SELECT_NEXT_REGION',
    SELECT_REGION: 'SELECT_REGION'
  },
  USER: {
    LOGOUT: 'LOGOUT'
  }
}

export default ActionType;
