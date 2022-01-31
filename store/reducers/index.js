import { combineReducers } from 'redux'
import productsReducer from './products'
import userReducer from './user'

// COMBINED REDUCERS
const reducers = {
  products: productsReducer,
  user: userReducer
}

export default combineReducers(reducers)
