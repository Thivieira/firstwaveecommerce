import dynamic from 'next/dynamic'
import { NextSeo } from 'next-seo'

import api from '../services/api'
import NavLink from '../components/NavLink'

const CarouselImage = dynamic(() => import('../components/landing/CarouselImage'))

const ProductsSlider = dynamic(() => import('../components/landing/ProductsSlider'))

const { getLayout } = dynamic(() => import('../layouts/SiteLayout'))

import { Payment, LocalShipping } from '@material-ui/icons'
import { BarcodeOutlined } from '@ant-design/icons'

const Index = ({ prodMasc, prodOutlet }) => {
  return (
    <div className="landing-container">
      {/* <NextSeo title="Lifestyle Floripa by Billabong" description="Sua surf shop na Praia Mole." /> */}
      <CarouselImage />

      <div className="payment-information-container">
        <div className="payment-information">
          <Payment className="payment-information-image" />
          <p className="payment-information-text">EM ATÉ 6X NO CARTÃO SEM JUROS</p>
        </div>
        <div className="payment-information">
          <LocalShipping className="payment-information-image" />
          <h2>
            <strong></strong>
          </h2>
        </div>
        <div className="payment-information">
          <BarcodeOutlined className="payment-information-image" />
          <p className="payment-information-text">12% DE DESCONTO NO BOLETO E PIX</p>
        </div>
      </div>

      <div className="products-carousel-container">
        <h3 className="products-carousel-title">NOVIDADES</h3>
        <ProductsSlider prod={prodMasc} />
      </div>

      <div className="container-images">
        <div className="three-images">
          <div className="two-images">
            <NavLink href="/produtos/Masculino">
              <img className="first-image" src="/Categorias-Masculino.jpg" alt="" />
            </NavLink>
            <NavLink href="/produtos/Feminino">
              <img className="second-image" src="/Categorias-Feminino.jpg" alt="" />
            </NavLink>
          </div>
          <NavLink href="/produtos/Calcado">
            <img className="image-right" src="/Categorias-Calcados.jpg" alt="" />
          </NavLink>
        </div>
        <NavLink href="/produtos/Juvenil">
          <img className="bottom-image" src="/Categorias-Juvenil.jpg" alt="" />
        </NavLink>
      </div>

      <div className="products-carousel-container">
        <NavLink className="products-carousel-title" href="/produtos/Outlet">
          Promoções
        </NavLink>

        <ProductsSlider prod={prodOutlet} />
      </div>

      <div className="container-images">
        <div className="three-images">
          <div className="two-images">
            <NavLink href="/produtos/Acessorio/Relogio">
              <img className="first-image" src="/Categorias-Relogio.jpg" alt="" />
            </NavLink>
            <NavLink href="/produtos/Acessorio/Oculos">
              <img className="second-image" src="/Categorias-Oculos.jpg" alt="" />
            </NavLink>
          </div>
          <NavLink href="/produtos/Surf">
            <img className="image-right" src="/Categorias-Surf.jpg" alt="" />
          </NavLink>
        </div>
        <NavLink href="/produtos/Acessorio">
          <img className="bottom-image" src="/Categorias-Acessorios.jpg" alt="" />
        </NavLink>
      </div>
    </div>
  )
}

Index.getLayout = getLayout

export default Index

export const getStaticProps = async () => {
  const resMasc = await api.get('/products?limit=12')
  const prodMasc = resMasc.data.data

  const resOutlet = await api.get('/products?category=outlet&limit=12')
  const prodOutlet = resOutlet.data.data

  return {
    props: { prodMasc, prodOutlet },
    revalidate: 60 * 60 * 1 //a cada 1 horas uma nova req na API será feita
  }
}
