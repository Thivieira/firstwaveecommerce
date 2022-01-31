const userDefaultState = {
  account: {},
  address: {},
  orders: []
}

const userReducer = (state = userDefaultState, action) => {
  switch (action.type) {
    case 'SAVE_ACCOUNT':
      return { ...state, account: action.payload }
    case 'SAVE_ADDRESS':
      return { ...state, address: action.payload }
    case 'SAVE_ORDERS':
      return { ...state, orders: action.payload }
  }
  return state
}

export default userReducer
