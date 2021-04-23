export const getCartState = (state) => state.products.cart;

export const getColorState = (state) => state.products.color;

export const getSizeState = (state) => state.products.size;

export const getCartTotal = (state) => state.products.total;

export const getAllProducts = (state) => state.products.products;
export const getSliderProduct = (state) => state.products.sliderProducts;
export const getProduct = (state) => state.products.product;

export const getIsOpen = (state) => state.products.isOpen;

export const getLoading = (state) => state.products.loading;

/////////////////////////////////////////////////////////////////////////////

export const getFavoritesProd = (state) => state.products.favoritesProducts;

/////////////////////////////////////////////////////////////////////////////

export const getAllProductBrands = (state) =>
  state.products.products
    .map((product) => product.marca)
    .reduce(
      (unique, brand) => (unique.includes(brand) ? unique : [...unique, brand]),
      []
    );

export const getAllProductSize = (state) =>
  state.products.products
    .map((product) => product)
    .map((el) => el.variacoes)
    .map((el) => el[0])
    .map((el) => el.variacao)
    .map((el) => el.nome)
    .map((el) => el.split(";"))
    .map((el) => el.slice(1, 2))
    .map((el) => el[0])
    .map((el) => el.split(":"))
    .map((el) => el.slice(1, 2))
    .map((el) => el[0]);

export const getAllProductColor = (state) =>
  state.products.products
    .map((product) => product)
    .map((el) => el.variacoes)
    .map((el) => el[0])
    .map((el) => el.variacao)
    .map((el) => el.nome)
    .map((el) => el.substr(4))
    .map((el) => el.split(";"))
    .map((el) => el.slice(0, 1))
    .map((el) => el[0]);
