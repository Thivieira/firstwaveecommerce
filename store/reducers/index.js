import { combineReducers } from "redux";
import * as types from "../actions/types";
import productsReducer from "./products";
import userReducer from "./user";
const { persistReducer } = require("redux-persist");
import storage from "../storage";

const productsPersistConfig = {
  key: "products",
  storage: storage,
  whitelist: ["cart", "total", "favoritesProducts"],
};

// COMBINED REDUCERS
const reducers = {
  products: persistReducer(productsPersistConfig, productsReducer),
  user: persistReducer(
    {
      key: "user",
      storage: storage,
    },
    userReducer
  ),
};

export default combineReducers(reducers);
