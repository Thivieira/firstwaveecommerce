const userDefaultState = {
  account: {},
  address: {},
};

const userReducer = (state = userDefaultState, action) => {
  switch (action.type) {
    case "SAVE_ACCOUNT":
      return { ...state, account: action.payload };
      break;
    case "SAVE_ADDRESS":
      return { ...state, address: action.payload };
      break;
  }
  return state;
};

export default userReducer;
