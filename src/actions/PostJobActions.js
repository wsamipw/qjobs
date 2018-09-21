import { SAVE_MULTIPLE_POST_JOB_SCREENS_STATE } from "./types";

export const saveMultiplePostJobScreensState = payload => {
  return {
    type: SAVE_MULTIPLE_POST_JOB_SCREENS_STATE,
    payload
  };
};
