export const getProducts = (products) => ({
  type: "GET_API_ALL_PRODUCTS",
  payload: products,
});

export const sliderProducts = (sliderProducts) => ({
  type: "GET_API_SLIDER_PRODUCTS",
  payload: sliderProducts,
});

export const openProduct = (product) => ({
  type: "GET_API_PRODUCT",
  payload: product,
});

export const addToCart = (product) => ({
  type: "ADD_TO_CART",
  payload: product,
});

export const changeIsOpen = (is_Open) => ({
  type: "is_Open",
  payload: is_Open,
});

export const setLoading = (loading) => ({
  type: "SET_LOADING",
  payload: loading,
});

////////////////////////////////////////////////////

export const setFavorite = (obj) => ({
  type: "SET_FAVORITE",
  payload: obj,
});

export const addToFavorites = (id) => ({
  type: "ADD_TO_FAVORITES",
  payload: id,
});

export const removeFromFavorites = (id) => ({
  type: "REMOVE_FROM_FAVORITES",
  payload: id,
});

////////////////////////////////////////////////////

export const removeFromCart = (codigoVariacao) => ({
  type: "REMOVE_FROM_CART",
  codigoVariacao,
});

export const decrementFromCart = (codigoVariacao) => ({
  type: "DECREMENT",
  codigoVariacao,
});

export const incrementFromCart = (codigoVariacao) => ({
  type: "INCREMENT",
  codigoVariacao,
});

export const clearProducts = () => ({
  type: "CLEAR_PRODUCTS",
});

export const clearFavoritesProd = () => ({
  type: "CLEAR_FAVORITES",
});

export const clearProduct = () => ({
  type: "CLEAR_PRODUCT",
});

export const clearCart = () => ({
  type: "CLEAR_CART",
});

export const setPreferenceId = (preferenceId) => ({
  type: "SET_ACTIVE_PREFERENCE_ID",
  payload: preferenceId,
});
