import { Provider } from "react-redux";
import { useStore } from "../store/index";
import { PersistGate } from "redux-persist/integration/react";
import "../styles/Global.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Landing.css";
import "../components/landing/carouselImage.css";
import "../components/landing/productsSlider.css";

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <PersistGate persistor={store.__PERSISTOR} loading={null}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}
