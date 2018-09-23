import { combineReducers } from "redux";
import myNavigationReducer from "./NavigationReducer";
import postJobReducer from "./PostJobReducer";
import extraReducer from "./extraReducer";

export default combineReducers({
  myNavigationReducer,
  postJobReducer,
  extraReducer
});
