import { Provider } from "react-redux";
import { useStore } from "../store";
import { PersistGate } from "redux-persist/integration/react";
import SiteLayout from "../layouts/SiteLayout";
import "antd/dist/antd.css";
import "../styles/global.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Landing.css";
import "../components/landing/carouselImage.css";
import "../components/landing/productsSlider.css";
import "../components/FloatCart/floatcart.css";
import "../partials/header.css";
import "../partials/footer.css";
import "../components/Products/productDetails.css";

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  const getLayout =
    Component.getLayout || ((page) => <SiteLayout children={page} />);

  return (
    <Provider store={store}>
      <PersistGate persistor={store.__PERSISTOR} loading={null}>
        {getLayout(<Component {...pageProps} />)}
      </PersistGate>
    </Provider>
  );
}
