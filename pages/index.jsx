import Link from "next/link";
import api from "../services/api";

import CarouselImage from "../components/landing/CarouselImage";
import { Payment, LocalShipping, AttachMoney } from "@material-ui/icons";

import ProductsSlider from "../components/landing/ProductsSlider";

import { getLayout } from "../layouts/SiteLayout";
import { RightCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const Index = ({ prod }) => {
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
            {/* <p className="centered">
              <strong>FRETE GRÁTIS</strong>
            </p> */}
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

      <div className="images-container-two">
        <div className="wrapper-equal-images">
          <img src="/5.jpg" alt="banner" />
          <Link href="/produtos/Acessorio">
            <button type="button" className="btn-acess">
              FEMININO
              <RightCircleOutlined
                style={{ fontSize: "1.1rem", margin: "0 5px" }}
              />
            </button>
          </Link>
        </div>

        <div className="wrapper-equal-images">
          <img src="/8.jpg" alt="banner" />
          <Link href="/produtos/Juvenil">
            <button type="button" className="btn-infa">
              MASCULINO
              <RightCircleOutlined
                style={{ fontSize: "1.1rem", margin: "0 5px" }}
              />
            </button>
          </Link>
        </div>
      </div>

      <div className="products-carousel-container">
        <h3 className="products-carousel-title">Mais vendidos</h3>
        <ProductsSlider prod={prod} />
      </div>

      <div className="images-container-two">
        <div className="wrapper-equal-images">
          <img src="/10.png" alt="banner" />
          <Link href="/produtos/Acessorio">
            <button
              type="button"
              className="btn-acess"
              style={{ marginRight: "20px" }}
            >
              SURF
              <RightCircleOutlined
                style={{ fontSize: "1.1rem", margin: "0 5px" }}
              />
            </button>
          </Link>
        </div>

        <div className="wrapper-equal-images">
          <img src="/2.jpeg" alt="banner" />
          <Link href="/produtos/Juvenil">
            <button type="button" className="btn-infa">
              ACESSÓRIOS
              <RightCircleOutlined
                style={{ fontSize: "1.1rem", margin: "0 5px" }}
              />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

Index.getLayout = getLayout;

export default Index;

export const getStaticProps = async () => {
  const res = await api.get("/products?genre=masculino");

  const prod = res.data.data;

  return {
    props: { prod },
    revalidate: 60 * 60 * 1, //a cada 1 horas uma nova req na API será feita
  };
};
