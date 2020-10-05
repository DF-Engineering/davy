import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import accountReducer from "./accountReducer";

export default combineReducers({
  errors: errorReducer,
  stripe: accountReducer
});
