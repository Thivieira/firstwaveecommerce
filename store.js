import { useMemo } from "react";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { persistStore } from "redux-persist";
import reducers from "./reducers";

let store;

const isClient = typeof window !== "undefined";

function initStore(initialState) {
  return createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
}

function initPersistedStore(initialState) {
  const { persistReducer } = require("redux-persist");
  const storage = require("redux-persist/lib/storage").default;

  const persistConfig = {
    key: "root",
    storage,
  };

  return createStore(
    persistReducer(persistConfig, reducers),
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
}

export const initializeStore = (preloadedState) => {
  let _store =
    store ?? isClient
      ? initPersistedStore(preloadedState)
      : initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    isClient
      ? (_store = initPersistedStore({
          ...store.getState(),
          ...preloadedState,
        }))
      : (_store = initStore({
          ...store.getState(),
          ...preloadedState,
        }));
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  if (isClient) store.__PERSISTOR = persistStore(store);

  return _store;
};

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
