import { combineReducers } from "redux";
import myNavigationReducer from "./NavigationReducer";
import postJobReducer from "./PostJobReducer";

export default combineReducers({
  myNavigationReducer,
  postJobReducer
});
