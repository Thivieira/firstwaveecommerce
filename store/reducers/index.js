import { combineReducers } from "redux";
import * as types from "../actions/types";
import productsReducer from "./products";
// COMBINED REDUCERS
const reducers = {
  products: productsReducer,
};

export default combineReducers(reducers);
