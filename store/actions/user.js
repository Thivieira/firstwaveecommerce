export const saveAccount = (account) => ({
  type: "SAVE_ACCOUNT",
  payload: account,
});

export const saveAddress = (address) => ({
  type: "SAVE_ADDRESS",
  payload: address,
});
