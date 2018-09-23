import { STORE_GEO_LOCATION } from "../actions/types";

const INITIAL_STATE = {
  // Not Used
  location: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // Not Used
    case STORE_GEO_LOCATION:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
