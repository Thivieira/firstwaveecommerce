import { combineReducers } from "redux";
import * as types from "../actions/types";
import productsReducer from "./products";
import userReducer from "./user";
// COMBINED REDUCERS
const reducers = {
  products: productsReducer,
  user: userReducer,
};

export default combineReducers(reducers);
