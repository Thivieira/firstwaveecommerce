import { combineReducers } from "redux";
import * as types from "../actions/types";
import productsReducer from "./products";
import userReducer from "./user";
const { persistReducer } = require("redux-persist");
const storage = require("redux-persist/lib/storage").default;

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
