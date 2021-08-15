export const setProducts = (products) => ({
  type: "GET_API_ALL_PRODUCTS",
  payload: products,
});

export const setPaginationProducts = (
  totalPages,
  currentPage,
  per_page,
  theTotal
) => ({
  type: "GET_PAGINATION_PRODUCTS",
  payload: { totalPages, currentPage, per_page, theTotal },
});

export const setFilterData = (
  filtersSize,
  filtersColor,
  filtersBrand,
  selectedPriceMin,
  selectedPriceMax
) => ({
  type: "GET_FILTER_DATA",
  payload: {
    size: filtersSize,
    color: filtersColor,
    brand: filtersBrand,
    priceMin: selectedPriceMin,
    priceMax: selectedPriceMax,
  },
});

export const setFilterUrl = (url) => ({
  type: "SET_FILTER_URL",
  payload: url,
});

export const setFilterMode = (boolean) => ({
  type: "SET_FILTER_MODE",
  payload: boolean,
});

export const sortProducts = (products, sort) => ({
  type: "SORT_PRODUCTS",
  payload: { products, sort },
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

export const setFavorites = (arr) => ({
  type: "SET_FAVORITES",
  payload: arr,
});

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

export const removeFromCart = (external_id) => ({
  type: "REMOVE_FROM_CART",
  external_id,
});

export const decrementFromCart = (external_id) => ({
  type: "DECREMENT",
  external_id,
});

export const incrementFromCart = (external_id) => ({
  type: "INCREMENT",
  external_id,
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

export const updateCart = (obj) => ({
  type: "UPDATE_CART",
  payload: { cart: obj.cart, total: obj.total },
});
