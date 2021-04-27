import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../services/api";

import CarouselImage from "../components/landing/CarouselImage";
import { Payment, LocalShipping, AttachMoney } from "@material-ui/icons";
// import modeloPe from "../assets/modelo.png";
// import modeloLado from "../assets/modelo2.png";

import ProductsSlider from "../components/landing/ProductsSlider";

import { getLayout } from "../layouts/SiteLayout";

const Index = ({ prod }) => {
  console.log("PROD", prod);
  return (
    <div className="landing-container">
      <CarouselImage />
      <div className="payment-information-container">
        <div className="payment-information">
          <Payment fontSize="large" />
          <p className="payment-information-text">
            Parcele suas compras em até <strong>10x</strong> no{" "}
            <strong>CARTÃO</strong>
          </p>
        </div>
        <div className="payment-information">
          <LocalShipping fontSize="large" />
          <div className="payment-information-text">
            <p className="centered">
              <strong>FRETE GRÁTIS</strong>
            </p>
            <p>R$200,00 - Sul e Sudeste</p>
            <p>R$499,00 - Demais regiões</p>
          </div>
        </div>
        <div className="payment-information">
          <AttachMoney fontSize="large" />
          <p className="payment-information-text">
            10% de <strong>DESCONTO</strong> no <strong>BOLETO</strong>
          </p>
        </div>
      </div>

      <div className="products-carousel-container">
        <h3 className="products-carousel-title">Novidades</h3>
        <ProductsSlider prod={prod} />
      </div>
      <div className="images-container">
        <img
          className="left-image"
          src="https://images.boardriders.com/global/billabong-products/all/default/hi-res/j3sb29bimu_billabong,l_1220_frt1.jpg"
          alt="roupa billabong"
        />
        <div className="right-images-container">
          <img
            className="right-image"
            src="https://dafitistatic-a.akamaihd.net/dynamic_yield/cms/static/kanui/images/129656a67616__banner_homesurf-BERMUDAS-SURF.jpg"
            alt="Surfistas"
          />
          <img className="right-image" src="/modelo2.png" alt="Surfistas" />
        </div>
      </div>
      <div className="products-carousel-container">
        <h3 className="products-carousel-title">Mais vendidos</h3>
        <ProductsSlider prod={prod} />
      </div>
      <div className="images-container">
        <img
          className="equal-images"
          src="https://d2e5mvjndnxyoo.cloudfront.net/Custom/Content/Banners/50/50_banner637335224265250393.jpg"
          alt="roupa billabong"
        />
        <img
          className="equal-images"
          src="https://d2e5mvjndnxyoo.cloudfront.net/Custom/Content/Banners/51/51_banner637335222001214070.jpg"
          alt="roupa billabong"
        />
      </div>
    </div>
  );
};

Index.getLayout = getLayout;

export default Index;

export const getStaticProps = async () => {
  const res = await api.get("/produtos/categoria?genero=masculino");

  const prod = res.data;

  return {
    props: { prod },
    revalidate: 60 * 60 * 8, //a cada 8 horas uma nova req na API será feita
  };
};
