import Router from "next/router";
import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { useStore } from "../store";
import NProgress from "nprogress";
import { CategoryContextProvider } from "../contexts/CategoryContext";

const SiteLayout = dynamic(() => import("../layouts/SiteLayout"));

import "../styles/global.css";
import "../styles/Landing.css";
import "../styles/table.css";
import "../styles/editAccount.css";
import "../styles/payment.css";
import "../styles/nprogress.css";

import "antd/dist/antd.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
import "./registrar/form.css";
import "./produtos/produtos.css";

import "../Utils/Box/box.css";
import "../Utils/ButtonsContainer/buttonsContainer.css";
import "../Utils/Separation/separation.css";
import "../Utils/InputContainer/inputContainer.css";
import "../Utils/Container/container.css";
import "../Utils/Title/title.css";
import "../Utils/NumeratedTitle/numeratedTitle.css";
import "../Utils/PaymentBox/paymentBox.css";

import api from "../services/api";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  const getLayout =
    Component.getLayout || ((page) => <SiteLayout children={page} />);

  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = "Bearer " + token;
    }

    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          // console.log(window.localStorage);
          window.localStorage.clear();
        }
        return error;
      }
    );
  }

  return (
    <Provider store={store}>
      <CategoryContextProvider>
        {getLayout(<Component {...pageProps} />)}
      </CategoryContextProvider>
    </Provider>
  );
}
