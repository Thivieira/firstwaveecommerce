const productsDefaultState = {
  products: [],
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
        (product) => product.id === apiProduct.id
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
      if (state.favoritesProducts.find((prod) => action.payload === prod.id)) {
        return {
          ...state,
        };
      }

      return {
        ...state,
        favoritesProducts: [
          ...state.favoritesProducts,
          state.products.find((product) => product.id === action.payload),
        ],
      };

    case "REMOVE_FROM_FAVORITES":
      const removeProductFavorites = state.favoritesProducts.filter(
        (product) => action.payload !== product.id
      );

      return {
        ...state,
        favoritesProducts: removeProductFavorites,
      };

    ///////////////////////////////////////////////////////////////////////

    case "ADD_TO_CART":
      const color = action.payload.color;
      const size = action.payload.size;
      const codigoVariacao = action.payload.codigoVariacao;
      const estoqueAtual = action.payload.estoqueAtual;
      const imagemVariacao = action.payload.imagemVariacao;

      const existingProductInCart = state.cart.find((existingProd) => {
        if (
          existingProd.color === color &&
          existingProd.size === size &&
          existingProd.codigoVariacao === codigoVariacao
        ) {
          return codigoVariacao === existingProd.codigoVariacao;
        }
      });

      if (existingProductInCart) {
        const productsIncrement = state.cart.find(
          (product) => codigoVariacao === product.codigoVariacao
        );

        if (productsIncrement.estoqueAtual === 0) {
          return {
            ...state,
          };
        }

        productsIncrement.quantity += 1;
        productsIncrement.estoqueAtual -= 1;
        const newTotalIncrement =
          state.total + parseFloat(productsIncrement.preco);

        return {
          ...state,
          total: newTotalIncrement,
        };
      } else {
        const addedProduct = Object.assign({}, state.product);

        addedProduct.quantity = 1;
        addedProduct.estoqueAtual = estoqueAtual - 1;
        addedProduct.size = size;
        addedProduct.color = color;
        addedProduct.codigoVariacao = codigoVariacao;
        addedProduct.imagemVariacao = imagemVariacao;

        const newTotal = state.total + parseFloat(addedProduct.preco);
        // console.log(addedProduct);

        return {
          ...state,
          cart: [...state.cart, addedProduct],
          total: newTotal,
        };
      }

    case "REMOVE_FROM_CART":
      const productToRemove = state.cart.find(
        (product) => action.codigoVariacao === product.codigoVariacao
      );

      const removeProduct = state.cart.filter(
        (product) => action.codigoVariacao !== product.codigoVariacao
      );

      const newTotal =
        state.total -
        parseFloat(productToRemove.preco) * productToRemove.quantity;

      return {
        ...state,
        cart: removeProduct,
        total: newTotal,
      };

    case "DECREMENT":
      const products = state.cart.find(
        (product) => action.codigoVariacao === product.codigoVariacao
      );

      if (products.quantity > 1) {
        products.quantity -= 1;
        products.estoqueAtual += 1;
        const newTotalDecrement = state.total - parseFloat(products.preco);

        return {
          ...state,
          total: newTotalDecrement,
        };
      } else {
        return state;
      }

    case "INCREMENT":
      const productsIncrement = state.cart.find(
        (product) => action.codigoVariacao === product.codigoVariacao
      );

      if (productsIncrement.estoqueAtual === 0) {
        return {
          ...state,
        };
      }

      productsIncrement.quantity += 1;
      productsIncrement.estoqueAtual -= 1;
      const newTotalIncrement =
        state.total + parseFloat(productsIncrement.preco);

      return {
        ...state,
        total: newTotalIncrement,
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

    default:
      return state;
  }
};

export default productsReducer;
