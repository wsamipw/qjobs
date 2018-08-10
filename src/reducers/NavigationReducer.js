import { SET_MAIN_NAVIGATION } from "../actions/types";

const INITIAL_STATE = {
  mainNavigation: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_MAIN_NAVIGATION:
      return { ...state, mainNavigation: action.payload };

    default:
      return state;
  }
};
