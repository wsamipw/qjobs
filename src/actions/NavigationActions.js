import { SET_MAIN_NAVIGATION } from "./types";

export const setMainNavigation = mainNavigator => ({
  type: SET_MAIN_NAVIGATION,
  payload: mainNavigator
});
