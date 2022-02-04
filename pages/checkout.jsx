import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFeaturedImage } from '../helpers'
import { getCartTotal, getCartState } from '../store/selectors/products'

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

const products = [
  {
    id: 1,
    name: 'High Wall Tote',
    href: '#',
    price: '$210.00',
    color: 'White and black',
    size: '15L',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/checkout-page-07-product-01.jpg',
    imageAlt: 'Front of zip tote bag with white canvas, white handles, and black drawstring top.'
  }
  // More products...
]

export default function Checkout() {
  const cart = useSelector(getCartState)
  const total = useSelector(getCartTotal)

  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [mp, setMp] = useState(false)
  const [mpState, setMpState] = useState({})
  // const cart = useSelector(getCartState)
  // const address = useSelector(getAddress)
  // const account = useSelector(getAccount)
  // const dispatch = useDispatch()

  const mpRun = useCallback(async () => {
    const mpInstance = new MercadoPago(process.env.NEXT_PUBLIC_PUBLIC_KEY, {
      locale: 'pt-BR'
    })

    setMp(mpInstance)

    // const paymentMethods = await mpInstance.getPaymentMethods({ bin: '411111' })

    // const installments = await mpInstance.getInstallments({
    //   amount: '1000',
    //   locale: 'pt-BR',
    //   bin: '411111',
    //   processingMode: 'aggregator'
    // })

    // setMpState({ ...mpState })

    // const cardForm = mp.cardForm({
    //   amount: '100.5',
    //   autoMount: true,
    //   form: {
    //     id: 'form-checkout',
    //     cardholderName: {
    //       id: 'form-checkout__cardholderName',
    //       placeholder: 'Card Holder'
    //     },
    //     cardholderEmail: {
    //       id: 'form-checkout__cardholderEmail',
    //       placeholder: 'E-mail'
    //     },
    //     cardNumber: {
    //       id: 'form-checkout__cardNumber',
    //       placeholder: 'Card Number'
    //     },
    //     cardExpirationDate: {
    //       id: 'form-checkout__cardExpirationDate',
    //       placeholder: 'Expiration date (MM/YYYY)'
    //     },
    //     securityCode: {
    //       id: 'form-checkout__securityCode',
    //       placeholder: 'CVV'
    //     },
    //     installments: {
    //       id: 'form-checkout__installments',
    //       placeholder: 'Installments'
    //     },
    //     identificationType: {
    //       id: 'form-checkout__identificationType',
    //       placeholder: 'Document Type'
    //     },
    //     identificationNumber: {
    //       id: 'form-checkout__identificationNumber',
    //       placeholder: 'Document Number'
    //     },
    //     issuer: {
    //       id: 'form-checkout__issuer',
    //       placeholder: 'Issuer'
    //     }
    //   },
    //   callbacks: {
    //     onFormMounted: (error) => {
    //       if (error) return console.warn('Form Mounted handling error: ', error)
    //       console.log('Form mounted')
    //     },

    //     onFormUnmounted: (error) => {
    //       if (error) return console.warn('Form Unmounted handling error: ', error)
    //       console.log('Form unmounted')
    //     },
    //     onIdentificationTypesReceived: (error, identificationTypes) => {
    //       if (error) return console.warn('identificationTypes handling error: ', error)
    //       console.log('Identification types available: ', identificationTypes)
    //     },
    //     onPaymentMethodsReceived: (error, paymentMethods) => {
    //       if (error) return console.warn('paymentMethods handling error: ', error)
    //       console.log('Payment Methods available: ', paymentMethods)
    //     },
    //     onIssuersReceived: (error, issuers) => {
    //       if (error) return console.warn('issuers handling error: ', error)
    //       console.log('Issuers available: ', issuers)
    //     },
    //     onInstallmentsReceived: (error, installments) => {
    //       if (error) return console.warn('installments handling error: ', error)
    //       console.log('Installments available: ', installments)
    //     },
    //     onCardTokenReceived: (error, token) => {
    //       if (error) return console.warn('Token handling error: ', error)
    //       console.log('Token available: ', token)
    //     },
    //     onSubmit: (event) => {
    //       event.preventDefault()

    //       const {
    //         paymentMethodId,
    //         issuerId,
    //         cardholderEmail,
    //         amount,
    //         token,
    //         installments,
    //         identificationNumber,
    //         identificationType
    //       } = cardForm.getCardFormData()

    //       fetch('/process_payment', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //           token,
    //           issuer_id,
    //           payment_method_id,
    //           transaction_amount: Number(amount),
    //           installments: Number(installments),
    //           description: 'Product description',
    //           payer: {
    //             email,
    //             identification: {
    //               type: identificationType,
    //               number: identificationNumber
    //             }
    //           }
    //         })
    //       })
    //     },
    //     onFetching: (resource) => {
    //       console.log('Fetching resource: ', resource)

    //       // Animate progress bar
    //       const progressBar = document.querySelector('.progress-bar')
    //       progressBar.removeAttribute('value')

    //       return () => {
    //         progressBar.setAttribute('value', '0')
    //       }
    //     }
    //   }
    // })

    // const checkout = mp.checkout({
    //   preference: {
    //     id: preferenceId
    //   },
    //   render: {
    //     container: '.cho-container',
    //     label: 'Pagar'
    //   },
    //   theme: {
    //     elementsColor: '#1890ff',
    //     headerColor: '#1890ff'
    //   },
    //   autoOpen: true,
    //   init_point: 'redirect'
    // })

    // window.mp = mp
    // window.checkout = checkout
    // window.location = `${init_point_arg}`
  }, [])

  // useEffect(() => {
  //   if (!account) {
  //     router.push('/')
  //   }
  // }, [account])

  useEffect(() => {
    loadMercadoPago(async () => {
      setLoaded(true)
      // const preferenceObj = await create_preference(cart, address, account)
      // dispatch(setPreferenceId(preferenceObj.preferenceId))
      mpRun()
    })
  }, [mpRun])

  const price = (product) => `R$${parseFloat(product.product.price).toFixed(2).replace('.', ',')}`

  const priceSale = (product) => `R$${parseFloat(product.price).toFixed(2).replace('.', ',')}`

  return (
    <div className="bg-white">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com" />
        <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp" />
      </Head>
      {/* Background color split screen for large screens */}
      <div
        className="fixed top-0 left-0 hidden w-1/2 h-full bg-white lg:block"
        aria-hidden="true"
      />
      <div
        className="hidden lg:block fixed top-0 right-0 w-1/2 h-full bg-[#0080A8]"
        aria-hidden="true"
      />

      <div className="relative grid grid-cols-1 mx-auto gap-x-16 max-w-7xl lg:px-8 lg:grid-cols-2 lg:pt-16">
        <h1 className="sr-only">Checkout</h1>

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

            <ul role="list" className="text-sm font-medium divide-y divide-white divide-opacity-10">
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
                      <p>{priceSale(product)}</p>
                    ) : (
                      <p>{price(product)}</p>
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
        </section>

        <section
          aria-labelledby="payment-and-shipping-heading"
          className="py-16 lg:max-w-lg lg:w-full lg:mx-auto lg:pt-0 lg:pb-24 lg:row-start-1 lg:col-start-1"
        >
          <h2 id="payment-and-shipping-heading" className="sr-only">
            Detalhes de pagamento e envio
          </h2>

          <form id="form-checkout">
            <div className="max-w-2xl px-4 mx-auto lg:max-w-none lg:px-0">
              <div>
                <h3 id="contact-info-heading" className="text-lg font-medium text-gray-900">
                  Informações de contato
                </h3>

                <div className="mt-6">
                  <label
                    htmlFor="form-checkout__cardholderEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="cardholderEmail"
                      id="form-checkout__cardholderEmail"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="form-checkout__cardholderEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="cardholderEmail"
                      id="form-checkout__cardholderEmail"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="form-checkout__cardholderEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Telefone
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="cardholderEmail"
                      id="form-checkout__cardholderEmail"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="form-checkout__cardholderEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CPF
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="cardholderEmail"
                      id="form-checkout__cardholderEmail"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">Endereço de entrega</h3>

                <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-3">
                  <div className="sm:col-span-3">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="address"
                        name="address"
                        autoComplete="street-address"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="city"
                        name="city"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                      Province
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="province"
                        name="province"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Postal code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="postal-code"
                        name="postal-code"
                        autoComplete="postal-code"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">Billing information</h3>

                <div className="flex items-center mt-6">
                  <input
                    id="same-as-shipping"
                    name="same-as-shipping"
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-[#0080A8] border-gray-300 rounded focus:ring-[#0080A8]"
                  />
                  <div className="ml-2">
                    <label htmlFor="same-as-shipping" className="text-sm font-medium text-gray-900">
                      Same as shipping information
                    </label>
                  </div>
                </div>
              </div> */}

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">Detalhes do pagamento</h3>
                <div className="grid grid-cols-3 mt-6 sm:grid-cols-4 gap-y-6 gap-x-4">
                  <div className="col-span-3 sm:col-span-4">
                    <label
                      htmlFor="form-checkout__cardholderName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome impresso no cartão
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="cardholderName"
                        id="form-checkout__cardholderName"
                        autoComplete="name"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 mt-6 sm:grid-cols-4 gap-y-6 gap-x-4">
                  <div className="col-span-3 sm:col-span-4">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                      Número do cartão
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="cardNumber"
                        id="form-checkout__cardNumber"
                        autoComplete="cc-number"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-3">
                    <label
                      htmlFor="cardExpirationDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Validade (MM/YYYY)
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        maxLength="7"
                        name="cardExpirationDate"
                        id="form-checkout__cardExpirationDate"
                        autoComplete="cc-exp"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="securityCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Código
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="securityCode"
                        id="form-checkout__securityCode"
                        autoComplete="csc"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <select name="issuer" id="form-checkout__issuer" />
                  <select name="identificationType" id="form-checkout__identificationType" />
                  <input
                    type="text"
                    name="identificationNumber"
                    id="form-checkout__identificationNumber"
                  />
                  <select name="installments" id="form-checkout__installments" />
                </div>
              </div>

              <div className="flex justify-end pt-6 mt-10 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-[#0080a8] border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-[#0080a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-[#0080A8]"
                >
                  Pagar
                </button>
                <progress value="0" className="progress-bar">
                  Carregando...
                </progress>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
