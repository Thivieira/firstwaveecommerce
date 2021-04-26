import { Provider } from "react-redux";
import { useStore } from "../store/index";
import { PersistGate } from "redux-persist/integration/react";

import Header from "../components/Header";

import "../styles/global.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Landing.css";
import "../components/landing/carouselImage.css";
import "../components/landing/productsSlider.css";
import "../components/Products/productDetails.css";
import "../components/Header/header.css";
import "../components/FloatCart/style.css";

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <PersistGate persistor={store.__PERSISTOR} loading={null}>
        <Header />
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}
