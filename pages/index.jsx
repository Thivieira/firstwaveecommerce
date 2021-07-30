import { NextSeo } from 'next-seo';
import Image from 'next/image'
import Link from "next/link";

import CarouselImage from "../components/landing/CarouselImage";
import ProductsSlider from "../components/landing/ProductsSlider";
import { getLayout } from "../layouts/SiteLayout";
import api from "../services/api";

import landing1 from '../public/landing1.jpg'
import landing2 from '../public/landing2.jpg'
import landing3 from '../public/landing3.png'
import landing4 from '../public/landing4.jpeg'

import { Payment, LocalShipping } from "@material-ui/icons";
import { RightCircleOutlined } from "@ant-design/icons";

const Index = ({ prod }) => {
  return (
    <div className="landing-container">
      <NextSeo
        title="Lifestyle Floripa by Billabong"
        description="Sua surf shop na Praia Mole."
      />
      <CarouselImage />

      <div className="payment-information-container">
        <div className="payment-information">
          <Payment fontSize="large" style={{fontSize: '2.5rem',  marginRight: '5px'}}/>
          <p className="payment-information-text">EM ATÉ 6X NO CARTÃO</p>
        </div>
        <div className="payment-information">
          <LocalShipping fontSize="large" style={{fontSize: '2.5rem', margin: '0.5rem'}}/>
          <h2><strong></strong></h2>
        </div>
        <div className="payment-information">
          <img 
            src="/icon-boleto.png" 
            alt="boleto" 
          />
          <p className="payment-information-text">
            12% DE DESCONTO NO BOLETO
          </p>
        </div>
      </div>

      <div className="products-carousel-container">
        <h3 className="products-carousel-title">NOVIDADES</h3>
        <ProductsSlider prod={prod} />
      </div>

      <div className="images-container-two">
        <div className="wrapper-equal-images">
          <Image 
            src={landing1}
            alt="banner" 
            // layout='fill'  
            width={560}
            height={640}
            className='image-landing'
          />
          <Link href="/produtos/Feminino">
            <button type="button" className="btn-acess">
              FEMININO
              <RightCircleOutlined
                style={{ fontSize: "1.1rem", margin: "0 5px" }}
              />
            </button>
          </Link>
        </div>

        <div className="wrapper-equal-images">
          <Image 
            src={landing2}
            alt="banner" 
            // layout='fill'  
            width={560}
            height={640}
            className='image-landing'
          />
          <Link href="/produtos/Masculino">
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
        <h3 className="products-carousel-title">OUTLET</h3>
        <ProductsSlider prod={prod} />
      </div>

      <div className="images-container-two">
        <div className="wrapper-equal-images">
          <Image 
            src={landing3}
            alt="banner" 
            // layout='fill'  
            width={560}
            height={640}
            className='image-landing'
          />
          <Link href="/produtos/Surf">
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
          <Image 
            src={landing4}
            alt="banner" 
            // layout='fill'  
            width={560}
            height={640}
            className='image-landing'
          />
          <Link href="/produtos/Acessorio">
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
