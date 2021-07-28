import { combineReducers } from "redux";
// import * as types from "../actions/types";
import productsReducer from "./products";
import userReducer from "./user";
// const { persistReducer } = require("redux-persist");
// import storage from "../storage";

//https://github.com/rt2zz/redux-persist/issues/816#issuecomment-757364129
// const productsPersistConfig = {
//   key: "products",
//   storage: storage,
//   timeout: 2000, //Set the timeout function to 2 seconds
//   whitelist: ["cart", "total", "favoritesProducts"],
// };

// COMBINED REDUCERS
const reducers = {
  // products: persistReducer(productsPersistConfig, productsReducer),
  // user: persistReducer(
  //   {
  //     key: "user",
  //     storage: storage,
  //   },
  //   userReducer
  // ),
  products: productsReducer,
  user: userReducer,
};

export default combineReducers(reducers);
