const productsDefaultState = {
  products: [],
  pagination: [],
  filter: {
    size: [],
    color: [],
    brand: [],
    priceMin: 0,
    priceMax: 2000,
  },
  filterUrl: "",
  filterMode: false,
  sliderProducts: [],
  product: [],
  favoritesProducts: [],
  cart: [],
  total: 0,
  isOpen: false,
  loading: false,
  activePreferenceId: null,
};

const productsReducer = (state = productsDefaultState, action) => {
  switch (action.type) {
    case "GET_API_ALL_PRODUCTS":
      let apiProducts = action.payload;

      if (!apiProducts) {
        return state;
      }

      apiProducts = apiProducts.map((element) => {
        const favorite = state.favoritesProducts.find(
          (product) => product.id === element.id
        );

        if (!favorite) {
          return {
            ...element,
            favorite: false,
          };
        }

        return {
          ...element,
          favorite: favorite.favorite,
        };
      });

      return {
        ...state,
        products: apiProducts,
      };

    case "GET_PAGINATION_PRODUCTS":
      return {
        ...state,
        pagination: action.payload,
      };

    case "GET_FILTER_DATA":
      //filtros selecionados
      return {
        ...state,
        filter: action.payload,
      };

    case "SET_FILTER_URL":
      return {
        ...state,
        filterUrl: action.payload,
      };
    case "SET_FILTER_MODE":
      return {
        ...state,
        filterMode: action.payload,
      };

    case "GET_API_SLIDER_PRODUCTS":
      let sliderProducts = action.payload;

      sliderProducts = sliderProducts.map((element) => {
        return {
          ...element,
          favorite: false,
        };
      });

      return {
        ...state,
        sliderProducts,
      };

    case "GET_API_PRODUCT":
      let apiProduct = action.payload;

      apiProduct.favorite = false;

      const favorite = state.favoritesProducts.find(
        (favorite) => favorite.product.id === apiProduct.id
      );

      if (favorite) {
        return {
          ...state,
          product: favorite,
        };
      } else {
        return {
          ...state,
          product: apiProduct,
        };
      }

    case "is_Open":
      return {
        ...state,
        isOpen: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    //////////////////////////////////////////////////////////////

    case "SET_FAVORITES":
      return {
        ...state,
        favoritesProducts: action.payload,
      };

    case "SET_FAVORITE":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id
            ? { ...product, favorite: action.payload.favorite }
            : product
        ),
        product:
          state.product.id === action.payload.id
            ? {
                ...state.product,
                favorite: action.payload.favorite,
              }
            : state.product,
      };

    case "ADD_TO_FAVORITES":
      if (
        state.favoritesProducts.find((prod) => action.payload.id === prod.id)
      ) {
        return {
          ...state,
        };
      }

      return {
        ...state,
        favoritesProducts: [...state.favoritesProducts, action.payload],
      };

    case "REMOVE_FROM_FAVORITES":
      const removeProductFavorites = state.favoritesProducts.filter(
        (favorite) => action.payload !== favorite.product.id
      );

      return {
        ...state,
        favoritesProducts: removeProductFavorites,
      };

    ///////////////////////////////////////////////////////////////////////

    case "ADD_TO_CART":
      const product_variation = action.payload;
      const external_id = product_variation.external_id;

      const existingProductVariationInCart = state.cart.find(
        (existingProductInCart) => {
          if (existingProductInCart.external_id === external_id) {
            return true;
          }
        }
      );

      if (existingProductVariationInCart) {
        const productsIncrement = state.cart.find(
          (existingProductInCart) =>
            external_id === existingProductInCart.external_id
        );

        if (productsIncrement.supply <= 0) {
          return {
            ...state,
          };
        }

        productsIncrement.quantity += 1;
        productsIncrement.supply -= 1;

        const newTotalIncrement =
          state.total + parseFloat(productsIncrement.price);

        return {
          ...state,
          total: newTotalIncrement,
        };
      } else {
        const addedProduct = Object.assign({}, product_variation);

        addedProduct.quantity = 1;
        addedProduct.supply = product_variation.supply - 1;

        const newTotal = state.total + parseFloat(addedProduct.price);

        return {
          ...state,
          cart: [...state.cart, addedProduct],
          total: newTotal,
        };
      }

    case "REMOVE_FROM_CART":
      const productToRemove = state.cart.find(
        (product_variation) =>
          action.external_id === product_variation.external_id
      );

      if (!productToRemove) {
        return state;
      }

      //testar logica
      const removeProduct = state.cart.filter(
        (product_variation) =>
          action.external_id !== product_variation.external_id
      );

      const newTotal =
        state.total -
        parseFloat(productToRemove.price) * productToRemove.quantity;

      return {
        ...state,
        cart: removeProduct,
        total: newTotal,
      };

    case "DECREMENT":
      const productVariationInCartToDecrement = state.cart.find(
        (product_variation) =>
          action.external_id === product_variation.external_id
      );

      if (productVariationInCartToDecrement.quantity > 1) {
        productVariationInCartToDecrement.quantity -= 1;
        productVariationInCartToDecrement.supply += 1;

        const newTotalDecrement =
          state.total - parseFloat(productVariationInCartToDecrement.price);

        return {
          ...state,
          cart: [...state.cart, productVariationInCartToDecrement],
          total: newTotalDecrement,
        };
      } else {
        return state;
      }

    case "INCREMENT":
      const productVariationInCartToIncrement = state.cart.find(
        (product_variation) =>
          action.external_id === product_variation.external_id
      );

      if (productVariationInCartToIncrement.supply <= 0) {
        return {
          ...state,
        };
      }

      productVariationInCartToIncrement.quantity += 1;
      productVariationInCartToIncrement.supply -= 1;
      const newTotalIncrement =
        state.total + parseFloat(productVariationInCartToIncrement.price);

      return {
        ...state,
        cart: [...state.cart, productVariationInCartToIncrement],
        total: newTotalIncrement,
      };

    case "UPDATE_CART":
      return {
        ...state,
        cart: action.payload.cart,
        total: action.payload.total,
      };

    case "CLEAR_PRODUCTS":
      return {
        ...state,
        products: [],
      };

    case "CLEAR_PRODUCT":
      return {
        ...state,
        product: [],
      };

    case "CLEAR_FAVORITES":
      return {
        ...state,
        favoritesProducts: [],
      };

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
        total: 0,
      };
    case "SET_ACTIVE_PREFERENCE_ID":
      return {
        ...state,
        activePreferenceId: action.payload,
      };
    case "SORT_PRODUCTS":
      let productsSorted = action.payload.products;
      let sort = action.payload.sort;

      return {
        ...state,
        products: action.payload.products,
      };

    default:
      return state;
  }
};

export default productsReducer;
