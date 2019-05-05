import {
  SAVE_MULTIPLE_POST_JOB_SCREENS_STATE,
  DELETE_MULTIPLE_POST_JOB_SCREENS_STATE,
  REMOVE_SELECTED_EXTRA_QUESTION
} from "./types";

export const saveMultiplePostJobScreensState = payload => {
  return {
    type: SAVE_MULTIPLE_POST_JOB_SCREENS_STATE,
    payload
  };
};

export const deleteMultiplePostJobScreensState = () => {
  return {
    type: DELETE_MULTIPLE_POST_JOB_SCREENS_STATE
  };
};

export const removeSelectedExtraQuestion = payload => {
  return {
    type: REMOVE_SELECTED_EXTRA_QUESTION,
    payload
  };
};
