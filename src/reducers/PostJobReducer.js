import {
  SAVE_MULTIPLE_POST_JOB_SCREENS_STATE,
  DELETE_MULTIPLE_POST_JOB_SCREENS_STATE
} from "../actions/types";

const INITIAL_STATE = {
  postJobState: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_MULTIPLE_POST_JOB_SCREENS_STATE:
      return {
        ...state,
        postJobState: { ...state.postJobState, ...action.payload }
      };

    case DELETE_MULTIPLE_POST_JOB_SCREENS_STATE:
      return {
        ...state,
        postJobState: null
      };

    default:
      return state;
  }
};
