import Link from "next/link";
import api from "../services/api";

import CarouselImage from "../components/landing/CarouselImage";
import { Payment, LocalShipping, AttachMoney } from "@material-ui/icons";

import ProductsSlider from "../components/landing/ProductsSlider";

import { getLayout } from "../layouts/SiteLayout";
import { RightCircleOutlined } from "@ant-design/icons";

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
        <div className='wrapper-left-image'>
          <img
            className="left-image"
            src="https://images.boardriders.com/global/billabong-products/all/default/hi-res/j3sb29bimu_billabong,l_1220_frt1.jpg"
            alt="roupa billabong"
          />
          <Link href='/produtos/Acessorio'>
            <button type='button' className='btn-left-image'>
              BIQUÍNIS
              <RightCircleOutlined style={{fontSize: '1.1rem', margin: '0 5px'}}/>
            </button>
          </Link>
        </div>

        <div className="right-images-container">
          <div className='wrapper-right-image'>
            <img
              className="right-image"
              src="https://dafitistatic-a.akamaihd.net/dynamic_yield/cms/static/kanui/images/129656a67616__banner_homesurf-BERMUDAS-SURF.jpg"
              alt="Surfistas"
            />
            <Link href='/produtos/Acessorio'>
              <button type='button' className='btn-right-image'>
                BERMUDAS
              <RightCircleOutlined style={{fontSize: '1.1rem', margin: '0 5px'}}/>
              </button>
            </Link>
          </div>

          <div className='wrapper-right-image'>
            <img 
              className="right-image" 
              src="/modelo2.png" 
              alt="Surfistas" 
            />
            <Link href='/produtos/Acessorio'>
              <button type='button' className='btn-right-image'>
                PRANCHAS
              <RightCircleOutlined style={{fontSize: '1.1rem', margin: '0 5px'}}/>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="products-carousel-container">
        <h3 className="products-carousel-title">Mais vendidos</h3>
        <ProductsSlider prod={prod} />
      </div>

      <div className="images-container-two">
        <div className='wrapper-equal-images'>
          <img
            src="https://d2e5mvjndnxyoo.cloudfront.net/Custom/Content/Banners/50/50_banner637335224265250393.jpg"
            alt="roupa billabong"
          />
          <Link href='/produtos/Acessorio'>
            <button type='button' className='btn-acess'>
              ACESSÓRIOS
              <RightCircleOutlined style={{fontSize: '1.1rem', margin: '0 5px'}}/>

            </button>
          </Link>
        </div>

        <div className='wrapper-equal-images'>
          <img
            src="https://d2e5mvjndnxyoo.cloudfront.net/Custom/Content/Banners/51/51_banner637335222001214070.jpg"
            alt="roupa billabong"
          />
          <Link href='/produtos/Juvenil'>
            <button type='button' className='btn-infa'>
              INFANTIL
              <RightCircleOutlined style={{fontSize: '1.1rem', margin: '0 5px'}}/>

            </button>
          </Link>
        </div>
      </div>

    </div>
  )
}

Index.getLayout = getLayout;

export default Index;

export const getServerSideProps = async () => {
  const res = await api.get("/produtos/categoria?genero=masculino");

  const prod = res.data;

  return {
    props: { prod },
    // revalidate: 60 * 60 * 8, //a cada 8 horas uma nova req na API será feita
  };
};
