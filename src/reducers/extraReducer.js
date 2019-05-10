import {
  STORE_GEO_LOCATION,
  STORE_NOTIFICATION_OBJECT
} from "../actions/types";

const INITIAL_STATE = {
  // Not Used
  location: null,
  notification: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // Not Used
    case STORE_GEO_LOCATION:
      return { ...state, ...action.payload };

    case STORE_NOTIFICATION_OBJECT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
