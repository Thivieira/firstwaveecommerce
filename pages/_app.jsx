import Router from 'next/router'
import dynamic from 'next/dynamic'
import { Provider } from 'react-redux'
import NProgress from 'nprogress'
import { ConfigProvider } from 'antd'
import ptBR from 'antd/lib/locale/pt_BR'
import { DefaultSeo } from 'next-seo'
import { CategoryContextProvider } from '../contexts/CategoryContext'
import { useStore } from '../store'

import '../styles/globals.css'
import '../styles/Landing.css'
import '../styles/table.css'
import '../styles/editAccount.css'
import '../styles/payment.css'
import '../styles/nprogress.css'
import '../styles/checkout.css'

import 'antd/dist/antd.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

import '../components/Breadcrumb/breadcrumb.css'
import '../components/Filter/filter.css'
import '../components/landing/carouselImage.css'
import '../components/landing/productsSlider.css'
import '../components/FloatCart/floatcart.css'
import '../components/Products/productDetails.css'
import '../components/Products/productCard.css'
import '../components/Form/form.css'
import '../partials/header.css'
import '../partials/footer.css'

import './login/login.css'
import './registrar/form.css'
import './produtos/produtos.css'

import '../components/Utils/Box/box.css'
import '../components/Utils/ButtonsContainer/buttonsContainer.css'
import '../components/Utils/Separation/separation.css'
import '../components/Utils/InputContainer/inputContainer.css'
import '../components/Utils/Container/container.css'
import '../components/Utils/Title/title.css'
import '../components/Utils/NumeratedTitle/numeratedTitle.css'
import '../components/Utils/PaymentBox/paymentBox.css'

import api from '../services/api'
import CheckoutContextProvider from '../contexts/CheckoutContext'

const SiteLayout = dynamic(() => import('../layouts/SiteLayout'))

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)

  const getLayout = Component.getLayout || ((page) => <SiteLayout children={page} />)

  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    }

    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          // console.log(window.localStorage);
          window.localStorage.removeItem('token')
        }
        return error
      }
    )
  }

  return (
    <Provider store={store}>
      <ConfigProvider locale={ptBR}>
        <CategoryContextProvider>
          <CheckoutContextProvider>
            <DefaultSeo
              title="Lifestyle Floripa by Billabong"
              description="Sua surf shop na Praia Mole."
            />
            {getLayout(<Component {...pageProps} />)}
          </CheckoutContextProvider>
        </CategoryContextProvider>
      </ConfigProvider>
    </Provider>
  )
}
