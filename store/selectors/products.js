export const getCartState = (state) => state.products.cart

export const getColorState = (state) => state.products.color

export const getSizeState = (state) => state.products.size

export const getCartTotal = (state) => state.products.total

export const getAllProducts = (state) => state.products.products
export const getSliderProduct = (state) => state.products.sliderProducts
export const getProduct = (state) => state.products.product

export const getIsOpen = (state) => state.products.isOpen

export const getLoading = (state) => state.products.loading

/////////////////////////////////////////////////////////////////////////////

export const getFavoritesProd = (state) => state.products.favoritesProducts

/////////////////////////////////////////////////////////////////////////////

export const getPaginationData = (state) => state.products.pagination

export const getFilterData = (state) => state.products.filter

export const getFilterUrl = (state) => state.products.filterUrl
export const getFilterMode = (state) => state.products.filterMode
