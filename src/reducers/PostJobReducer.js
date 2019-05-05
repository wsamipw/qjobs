import {
  SAVE_MULTIPLE_POST_JOB_SCREENS_STATE,
  DELETE_MULTIPLE_POST_JOB_SCREENS_STATE,
  REMOVE_SELECTED_EXTRA_QUESTION
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

    case REMOVE_SELECTED_EXTRA_QUESTION:
      const extraQuestion = state.postJobState.extraQuestion.filter(
        (_, index) => index !== action.payload.index
      );
      state.postJobState;
      return {
        ...state,
        postJobState: { ...state.postJobState, extraQuestion: extraQuestion }
      };

    default:
      return state;
  }
};
