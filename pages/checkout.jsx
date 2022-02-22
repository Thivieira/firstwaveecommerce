import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LocalShipping, Payment } from '@material-ui/icons'
import { BarcodeOutlined } from '@ant-design/icons'
import { getFeaturedImage, nullToString } from '../helpers'
import api from '../services/api'
import { getCartTotal, getCartState } from '../store/selectors/products'
import { getAccount, getAddress } from '../store/selectors/user'
import { saveAccount, saveAddress } from '../store/actions/user'
import Tabs from '../components/Payments/Tabs'
import ShippingContent from '../components/Payments/ShippingContent'
import { CheckoutContext } from '../contexts/CheckoutContext'
import useToken from '../contexts/TokenStorage'

export default function Checkout() {
  const [edit, setEdit] = useState(false)
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [complement, setComplement] = useState('')
  const [cep, setCep] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const cart = useSelector(getCartState)
  const total = useSelector(getCartTotal)
  const dispatch = useDispatch()
  const [jwt] = useToken()
  const {
    paymentRes,
    setPaymentRes,
    selectedShippingPrice,
    loading,
    checkoutForm,
    setCheckoutForm
  } = useContext(CheckoutContext)
  const router = useRouter()
  const account = useSelector(getAccount)
  const totalToPay = parseFloat(total) + parseFloat(selectedShippingPrice)
  const price = (product) => `R$${parseFloat(product.product.price).toFixed(2).replace('.', ',')}`
  const priceSale = (product) => `R$${parseFloat(product.price).toFixed(2).replace('.', ',')}`

  const getUserData = useCallback(() => {
    api
      .get('/auth/me')
      .then((res) => {
        dispatch(
          saveAccount({
            cpf: res.data.cpf,
            email: res.data.email,
            name: res.data.name,
            phone: res.data.mobile
          })
        )
        setPersonalData({
          cpf: res.data.cpf,
          email: res.data.email,
          name: res.data.name,
          mobile: res.data.mobile
        })
      })
      .catch((e) => {})
  }, [dispatch])

  const getAddressData = useCallback(() => {
    api
      .get('/auth/address')
      .then((res) => {
        setStreet(nullToString(res.data.address))
        setNumber(nullToString(res.data.addressNumber))
        setComplement(nullToString(res.data.complement))
        setCep(nullToString(res.data.postalCode))
        setState(nullToString(res.data.uf))
        setCity(nullToString(res.data.city))
        setNeighborhood(nullToString(res.data.province))
        dispatch(
          saveAddress({
            street: nullToString(res.data.address),
            number: rnullToString(es.data.addressNumber),
            complement: nullToString(res.data.complement),
            zipcode: nullToString(res.data.postalCode),
            state: nullToString(res.data.uf),
            city: nullToString(res.data.city),
            neighborhood: nullToString(res.data.province)
          })
        )
      })
      .catch(() => {})
  }, [dispatch])

  useEffect(() => {
    getUserData()
    getAddressData()
  }, [edit, getUserData, getAddressData])

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (Object.keys(account).length === 0 || total === 0) {
  //       router.push('/')
  //     }
  //   }, 1000)
  // }, [account])

  useEffect(() => {
    // setTimeout(() => {
    //   if (Object.keys(account).length === 0) {
    //     console.log(total, 'seriously?')
    //     router.push('/')
    //   }
    // }, 3000)
  }, [account])

  return (
    <div className="relative bg-white">
      {/* Background color split screen for large screens */}
      <div
        className="absolute top-0 left-0 hidden w-1/2 h-full bg-white lg:block"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 hidden w-1/2 h-full lg:block"
        style={{ backgroundImage: 'linear-gradient(50deg , #7dd9f5, #005772)' }}
        aria-hidden="true"
      />

      <div className="relative grid grid-cols-1 mx-auto gap-x-16 max-w-7xl lg:px-8 lg:grid-cols-2 lg:pt-16">
        <section
          aria-labelledby="summary-heading"
          className="bg-[#0080A8] text-white py-12 md:px-10 lg:max-w-lg lg:w-full lg:mx-auto lg:px-0 lg:pt-0 lg:pb-24 lg:bg-transparent lg:row-start-1 lg:col-start-2"
        >
          <div className="max-w-3xl px-4 mx-auto lg:max-w-none lg:px-0">
            <dl>
              <dt className="text-base font-medium">Pedido</dt>
            </dl>

            <ul className="text-sm font-medium divide-y divide-white divide-opacity-10">
              {cart.map((product) => (
                <li key={product.external_id} className="flex items-start py-6 space-x-4">
                  <Link href={`/produto/${product.father_code}`} passHref>
                    <img
                      src={getFeaturedImage(product.image)}
                      alt={product.product.description}
                      className="flex-none object-cover object-center w-24 h-24 rounded-md cursor-pointer"
                    />
                  </Link>

                  <div className="flex-auto space-y-1">
                    <h3 className="text-white">{product.product.description}</h3>
                    <div className="flex">
                      <p>{product.color && product.color}</p>
                      <p className="ml-2">{product.size && product.size}</p>
                    </div>
                    <p> Quantidade: {product.quantity} </p>
                  </div>
                  <p className="flex-none text-base font-medium text-white">
                    {priceSale(product) !== price(product) ? (
                      <span>{priceSale(product)}</span>
                    ) : (
                      <span>{price(product)}</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="pt-6 space-y-6 text-sm font-medium border-t border-white border-opacity-10">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd>{`R$${total.toFixed(2).replace('.', ',')}`}</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt>Entrega</dt>
                <dd>{`R$${selectedShippingPrice && selectedShippingPrice.replace('.', ',')}`}</dd>
              </div>

              <div className="flex items-center justify-between pt-6 text-white border-t border-white border-opacity-10">
                <dt className="text-lg">Total</dt>
                <dd className="text-lg">{`R$${totalToPay
                  .toFixed(2)
                  .toString()
                  .replace('.', ',')}`}</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-row items-start justify-center px-8 pt-10 sm:px-16 md:px:0">
            <div className="flex flex-col px-0 payment-information">
              <Payment className="w-10 h-10 payment-information-image" />
              <p className="mt-1 text-center payment-information-text">
                EM ATÉ 6X NO CARTÃO SEM JUROS
              </p>
            </div>
            <div className="flex flex-col px-0 payment-information" style={{ border: 'none' }}>
              <LocalShipping className="w-10 h-10 payment-information-image" />
              <h2>
                <strong className="pt-5 text-white" />
              </h2>
            </div>
            <div className="flex flex-col px-0 payment-information">
              <BarcodeOutlined
                className="w-10 h-6 payment-information-image"
                style={{ fontSize: '2rem' }}
              />
              <p className="mt-0 text-center payment-information-text">
                12% DE DESCONTO NO BOLETO E PIX
              </p>
            </div>
          </div>
        </section>

        <section className="lg:max-w-lg lg:w-full lg:mx-auto lg:pt-0 lg:pb-24 lg:row-start-1 lg:col-start-1">
          <form id="form-checkout">
            <div className="max-w-2xl px-4 py-16 mx-auto lg:py-0 lg:max-w-none lg:px-0">
              <div className="">
                <h3 className="text-2xl font-bold text-[#0080A8]">Endereço de entrega</h3>

                <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-4 lg:grid-cols-3">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Endereço de entrega
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        onChange={(e) => setStreet(e.target.value)}
                        value={street}
                        placeholder="Endereço de entrega"
                        id="address"
                        name="address"
                        autoComplete="street-address"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Número
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        onChange={(e) => setNumber(e.target.value)}
                        value={number}
                        placeholder="Número"
                        id="number"
                        name="number"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Complemento
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        onChange={(e) => setComplement(e.target.value)}
                        value={complement}
                        placeholder="Complemento"
                        id="complement"
                        name="complement"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      CEP
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        onChange={(e) => setCep(e.target.value)}
                        value={cep}
                        placeholder="CEP"
                        id="cep"
                        name="cep"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                      Estado
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        onChange={(e) => setState(e.target.value)}
                        value={state}
                        placeholder="Estado"
                        id="state"
                        name="state"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      Cidade
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        onChange={(e) => setCity(e.target.value)}
                        value={city}
                        placeholder="Cidade"
                        id="city"
                        name="city"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <ShippingContent cep={cep} />
              </div>
              <div className="mt-5">
                <Tabs />
              </div>
              <div className="flex justify-start pt-6 mt-5 border-t border-gray-200">
                <button
                  type="submit"
                  id="form-checkout__submit"
                  className="bg-[#0080a8] border border-transparent uppercase rounded-md shadow-sm py-2 px-4  font-medium text-white hover:bg-[#0080a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-[#0080A8]"
                >
                  Finalizar Pedido
                </button>
              </div>
            </div>
            {loading && <p>Carregando...</p>}
          </form>
        </section>
      </div>
    </div>
  )
}
