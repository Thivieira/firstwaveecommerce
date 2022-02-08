import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LocalShipping, Payment } from '@material-ui/icons'
import { BarcodeOutlined } from '@ant-design/icons'
import { getFeaturedImage } from '../helpers'
import api from '../services/api'
import { getCartTotal, getCartState } from '../store/selectors/products'
import { getAccount, getAddress } from '../store/selectors/user'
import { saveAccount, saveAddress } from '../store/actions/user'
import Tabs from '../components/Payments/Tabs'
import Shipping from '../components/Payments/Shipping'
import { CheckoutContext } from '../contexts/CheckoutContext'
import useToken from '../contexts/TokenStorage'

export default function Checkout() {
  const [loading, setLoading] = useState(false)
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
        setStreet(res.data.address)
        setNumber(res.data.addressNumber)
        setComplement(res.data.complement)
        setCep(res.data.postalCode)
        setState(res.data.uf)
        setCity(res.data.city)
        setNeighborhood(res.data.province)
        dispatch(
          saveAddress({
            street: res.data.address,
            number: res.data.addressNumber,
            complement: res.data.complement,
            zipcode: res.data.postalCode,
            state: res.data.uf,
            city: res.data.city,
            neighborhood: res.data.province
          })
        )
      })
      .catch(() => {})
  }, [dispatch])

  useEffect(() => {
    getUserData()
    getAddressData()
  }, [edit, getUserData, getAddressData])

  const loadMercadoPago = (callback) => {
    const existingScript = document.getElementById('mercadoPagoSdkScript')
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://sdk.mercadopago.com/js/v2'
      script.id = 'mercadoPagoSdkScript'
      document.body.appendChild(script)
      script.onload = () => {
        if (callback) callback()
      }
    }
    if (existingScript && callback) callback()
  }

  async function handleEditAddress() {
    if (edit) {
      await api
        .post('/auth/address', {
          province: neighborhood,
          postalCode: cep,
          city,
          complement,
          uf: state,
          addressNumber: number,
          address: street
        })
        .then(() => {
          MySwal.fire({
            title: <p>Endereço editado com sucesso!</p>,
            confirmButtonText: 'OK'
          })
        })
        .catch(() => {
          MySwal.fire({
            title: <p>Falha ao editar endereço!</p>,
            confirmButtonText: 'OK'
          })
        })
    } else {
      setEdit(true)
    }
  }

  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [mp, setMp] = useState(false)
  const [mpState, setMpState] = useState({})
  const { paymentMethods, setPaymentMethods, paymentRes, setPaymentRes } =
    useContext(CheckoutContext)

  const address = useSelector(getAddress)
  const account = useSelector(getAccount)

  // useEffect(async () => {
  //   const res = await fetch('/api/mercadopago/payment-methods')
  //   const data = await res.json()
  //   setPaymentMethods(data)
  // }, [])

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (Object.keys(account).length === 0 || total === 0) {
  //       router.push('/')
  //     }
  //   }, 1000)
  // }, [account])

  const mpRun = useCallback(async () => {
    const mpInstance = new MercadoPago(process.env.NEXT_PUBLIC_PUBLIC_KEY, {
      locale: 'pt-BR'
    })

    setMp(mpInstance)

    setMpState({ ...mpState })
  }, [])

  useEffect(() => {
    if (mp) {
      const cardForm = mp.cardForm({
        amount: total.toString(),
        autoMount: true,
        form: {
          id: 'form-checkout',
          cardholderName: {
            id: 'form-checkout__cardholderName',
            placeholder: 'Card Holder'
          },
          cardholderEmail: {
            id: 'form-checkout__cardholderEmail',
            placeholder: 'E-mail'
          },
          cardNumber: {
            id: 'form-checkout__cardNumber',
            placeholder: 'Card Number'
          },
          cardExpirationDate: {
            id: 'form-checkout__cardExpirationDate',
            placeholder: 'Expiration date (MM/YYYY)'
          },
          securityCode: {
            id: 'form-checkout__securityCode',
            placeholder: 'CVV'
          },
          installments: {
            id: 'form-checkout__installments',
            placeholder: 'Installments'
          },
          identificationType: {
            id: 'form-checkout__identificationType',
            placeholder: 'Document Type'
          },
          identificationNumber: {
            id: 'form-checkout__identificationNumber',
            placeholder: 'Document Number'
          },
          issuer: {
            id: 'form-checkout__issuer',
            placeholder: 'Issuer'
          }
        },
        callbacks: {
          onFormMounted: (error) => {
            if (error) return console.warn('Form Mounted handling error: ', error)
            console.log('Form mounted')
          },

          onFormUnmounted: (error) => {
            if (error) return console.warn('Form Unmounted handling error: ', error)
            console.log('Form unmounted')
          },
          onIdentificationTypesReceived: (error, identificationTypes) => {
            if (error) return console.warn('identificationTypes handling error: ', error)
            console.log('Identification types available: ', identificationTypes)
          },
          onPaymentMethodsReceived: (error, paymentMethods) => {
            if (error) return console.warn('paymentMethods handling error: ', error)
            console.log('Payment Methods available: ', paymentMethods)
          },
          onIssuersReceived: (error, issuers) => {
            if (error) return console.warn('issuers handling error: ', error)
            console.log('Issuers available: ', issuers)
          },
          onInstallmentsReceived: (error, installments) => {
            if (error) return console.warn('installments handling error: ', error)
            console.log('Installments available: ', installments)
          },
          onCardTokenReceived: (error, token) => {
            if (error) return console.warn('Token handling error: ', error)
            console.log('Token available: ', token)
          },
          onSubmit: (event) => {
            event.preventDefault()
            setLoading(true)

            const {
              paymentMethodId,
              issuerId,
              cardholderEmail,
              amount,
              token,
              installments,
              identificationNumber,
              identificationType
            } = cardForm.getCardFormData()

            fetch('/api/payments', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`
              },
              body: JSON.stringify({
                token,
                cart,
                address,
                account,
                issuer_id: issuerId,
                payment_method_id: paymentMethodId,
                transaction_amount: Number(amount),
                installments: Number(installments),
                payer: {
                  email: cardholderEmail,
                  identification: {
                    type: identificationType,
                    number: identificationNumber
                  }
                }
              })
            })
              .then((res) => res.json())
              .then((res) => {
                router.push(`/status/${res.action}`)
                setPaymentRes(res)
              })
              .catch((res) => {
                router.push(`/status/${res.action}`)
                setPaymentRes(res)
              })
          },
          onFetching: (resource) => {
            console.log('Fetching resource: ', resource)
          }
        }
      })
    }
  }, [mp])

  // useEffect(() => {
  //   if (!account) {
  //     router.push('/')
  //   }
  // }, [account])

  useEffect(() => {
    loadMercadoPago(async () => {
      setLoaded(true)
      mpRun()
    })
  }, [mpRun])

  const price = (product) => `R$${parseFloat(product.product.price).toFixed(2).replace('.', ',')}`

  const priceSale = (product) => `R$${parseFloat(product.price).toFixed(2).replace('.', ',')}`

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
        {/* <h1 className="sr-only">Checkout</h1> */}

        <section
          aria-labelledby="summary-heading"
          className="bg-[#0080A8] text-white py-12 md:px-10 lg:max-w-lg lg:w-full lg:mx-auto lg:px-0 lg:pt-0 lg:pb-24 lg:bg-transparent lg:row-start-1 lg:col-start-2"
        >
          <div className="max-w-3xl px-4 mx-auto lg:max-w-none lg:px-0">
            <dl>
              <dt className="text-base font-medium">Pedido</dt>
              {/* <dd className="mt-1 text-3xl font-extrabold text-white">{`R$${total
                .toFixed(2)
                .replace('.', ',')}`}</dd> */}
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
                <dd>R$570.00</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt>Entrega</dt>
                <dd>R$25.00</dd>
              </div>

              <div className="flex items-center justify-between pt-6 text-white border-t border-white border-opacity-10">
                <dt className="text-lg">Total</dt>
                <dd className="text-lg">{`R$${total.toFixed(2).replace('.', ',')}`}</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-row items-start justify-center px-10 pt-20 sm:px-0">
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
                className="w-10 h-10 payment-information-image"
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
            <input
              type="hidden"
              id="form-checkout__cardholderEmail"
              className="hidden"
              value={account.email}
            />
            <div className="max-w-2xl px-4 py-16 mx-auto sm:py-0 lg:max-w-none lg:px-0">
              <div className="">
                <h3 className="text-2xl font-bold text-[#0080A8]">Endereço de entrega</h3>

                <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Endereço de entrega
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        onChange={(e) => setStreet(e.target.value)}
                        value={street}
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
                        id="city"
                        name="city"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Shipping />
              </div>

              <div className="mt-10">
                <Tabs />
              </div>
            </div>
            {loading && <p>Carregando...</p>}
          </form>
        </section>
      </div>
    </div>
  )
}
