import { Provider } from "react-redux";
import { useStore } from "../store";
import { PersistGate } from "redux-persist/integration/react";
import SiteLayout from "../layouts/SiteLayout";

import "../styles/global.css";
import "../styles/Landing.css";
import "../styles/table.css";
import "../styles/editAccount.css";
import "../styles/payment.css";

import "antd/dist/antd.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../components/Breadcrumb/breadcrumb.css";
import "../components/Filter/filter.css";
import "../components/landing/carouselImage.css";
import "../components/landing/productsSlider.css";
import "../components/FloatCart/floatcart.css";
import "../components/Products/productDetails.css";
import "../components/Products/productCard.css";
import "../components/Form/form.css";
import "../partials/header.css";
import "../partials/footer.css";

import "./login/login.css";
import "./form/form.css";
import "./produtos/produtos.css";

import "../Utils/Box/box.css";
import "../Utils/ButtonsContainer/buttonsContainer.css";
import "../Utils/Separation/separation.css";
import "../Utils/InputContainer/inputContainer.css";
import "../Utils/Container/container.css";
import "../Utils/Title/title.css";
import '../Utils/NumeratedTitle/numeratedTitle.css';
import '../Utils/PaymentBox/paymentBox.css';

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  const getLayout = Component.getLayout || ((page) => <SiteLayout children={page} />);

  return (
    <Provider store={store}>
      <PersistGate persistor={store.__PERSISTOR} loading={null}>
        {getLayout(<Component {...pageProps} />)}
      </PersistGate>
    </Provider>
  );
}
