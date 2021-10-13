import dynamic from "next/dynamic";
import Image from "next/image";
import { NextSeo } from "next-seo";

import api from "../services/api";
import NavLink from '../components/NavLink'

const CarouselImage = dynamic(() =>
  import("../components/landing/CarouselImage")
);

const ProductsSlider = dynamic(() =>
  import("../components/landing/ProductsSlider")
);

const { getLayout } = dynamic(() => import("../layouts/SiteLayout"));

import landing1 from "../public/landing1.jpg";
import landing2 from "../public/landing2.jpg";
import landing3 from "../public/landing3.png";
import landing4 from "../public/landing4.jpeg";

import { Payment, LocalShipping } from "@material-ui/icons";
import { RightCircleOutlined, BarcodeOutlined } from "@ant-design/icons";

const Index = ({ prodMasc, prodOutlet }) => {
  return (
    <div className="landing-container">
      <NextSeo
        title="Lifestyle Floripa by Billabong"
        description="Sua surf shop na Praia Mole."
      />
      <CarouselImage />

      <div className="payment-information-container">
        <div className="payment-information">
          <Payment
            className='payment-information-image'
          />
          <p className="payment-information-text">EM ATÉ 6X NO CARTÃO SEM JUROS</p>
        </div>
        <div className="payment-information">
          <LocalShipping
            className='payment-information-image'
          />
          <h2>
            <strong></strong>
          </h2>
        </div>
        <div className="payment-information">
          <BarcodeOutlined
            className='payment-information-image'
          />
          <p className="payment-information-text">12% DE DESCONTO NO BOLETO E PIX</p>
        </div>
      </div>

      <div className="products-carousel-container">
        <h3 className="products-carousel-title">NOVIDADES</h3>
        <ProductsSlider prod={prodMasc} />
      </div>

      <div className="images-container-two">
        <div className="wrapper-equal-images">
          <Image
            src={landing1}
            alt="banner"
            width={560}
            height={640}
            priority
            className="image-landing"
          />
          <NavLink href="/produtos/Feminino" passHref>
            <button type="button" className="btn-acess">
              FEMININO
              <RightCircleOutlined
                style={{ fontSize: "1.1rem", margin: "0 5px" }}
              />
            </button>
          </NavLink>
        </div>

        <div className="wrapper-equal-images">
          <Image
            src={landing2}
            alt="banner"
            width={560}
            height={640}
            priority
            className="image-landing"
          />
          <NavLink href="/produtos/Masculino" passHref>
            <button type="button" className="btn-infa">
              MASCULINO
              <RightCircleOutlined
                style={{ fontSize: "1.1rem", margin: "0 5px" }}
              />
            </button>
          </NavLink>
        </div>
      </div>

      <div className="products-carousel-container">
        <NavLink 
          className="products-carousel-title"
          href='/produtos/Outlet'
        >
            Promoções
        </NavLink>
        <ProductsSlider prod={prodOutlet} />
      </div>

      <div className="images-container-two">
        <div className="wrapper-equal-images">
          <Image
            src={landing3}
            alt="banner"
            width={560}
            height={640}
            priority
            className="image-landing"
          />
          <NavLink href="/produtos/Surf" passHref>
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
          </NavLink>
        </div>

        <div className="wrapper-equal-images">
          <Image
            src={landing4}
            alt="banner"
            width={560}
            height={640}
            priority
            className="image-landing"
          />
          <NavLink href="/produtos/Acessorio" passHref>
            <button type="button" className="btn-infa">
              ACESSÓRIOS
              <RightCircleOutlined
                style={{ fontSize: "1.1rem", margin: "0 5px" }}
              />
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

Index.getLayout = getLayout;

export default Index;

export const getStaticProps = async () => {
  const resMasc = await api.get("/products?limit=12");
  const prodMasc = resMasc.data.data;

  const resOutlet = await api.get("/products?category=outlet&limit=12");
  const prodOutlet = resOutlet.data.data;

  return {
    props: { prodMasc, prodOutlet },
    revalidate: 60 * 60 * 1, //a cada 1 horas uma nova req na API será feita
  };
};
