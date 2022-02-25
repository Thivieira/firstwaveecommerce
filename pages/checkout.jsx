import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState, useContext, useMemo } from 'react'
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
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { pt } from 'yup-locale-pt'

export const ErrorComponent = ({ errors, name }) => {
  if (!errors) {
    return null
  }
  if (Object.keys(errors).length == 0) {
    return null
  }
  return errors[name] ? (
    <span className="m-1 text-sm text-red-600">{errors[name]?.message}</span>
  ) : null
}

export default function Checkout() {
  const router = useRouter()
  const account = useSelector(getAccount)
  const accountAddress = useSelector(getAddress)
  const cart = useSelector(getCartState)
  const total = useSelector(getCartTotal)
  const dispatch = useDispatch()
  const { selectedShippingPrice, loading } = useContext(CheckoutContext)

  yup.setLocale(pt)

  const schema = yup
    .object({
      shippingAddress: yup
        .object({
          address: yup.string().required().label('endereço'),
          number: yup.string().required().label('número'),
          complement: yup.string().nullable().label('complemento'),
          cep: yup.string().required().label('CEP'),
          state: yup.string().required().label('estado'),
          city: yup.string().required().label('cidade'),
          neighborhood: yup.string().required().label('bairro')
        })
        .label('endereço de envio'),
      shippingMethod: yup
        .object({
          id: yup.string().required('escolha um frete').label('método de envio'),
          name: yup.string().required().label('nome do método de envio'),
          price: yup.string().required().label('preço do método de envio')
        })
        .required()
        .default(undefined)
        .label('método de envio'),
      billingType: yup.string().required().label('método de pagamento'),
      checkoutForm: yup.object().when('billingType', (val) => {
        console.log(val, 'teste')
        return val == 'creditcard'
          ? yup
              .object({
                cardholderName: yup.string().required().label('nome do dono do cartão'),
                cardholderEmail: yup.string().email().required().label('email de faturamento'),
                cardNumber: yup.string().required().label('número do cartão'),
                cardExpirationDate: yup.string().required().label('data de expiração'),
                securityCode: yup.string().required().label('código de segurança'),
                issuer: yup.string().required().label('bandeira'),
                identificationType: yup
                  .string()
                  .required()
                  .label('tipo de documento de identificação'),
                identificationNumber: yup
                  .string()
                  .required()
                  .label('número do documento de identificação'),
                installments: yup.string().required().label('parcelamento'),
                cardTokenId: yup.string().required().label('token')
              })
              .label('formulário de pagamento em cartão')
          : yup.object({}).optional()
      }),

      originalAmount: yup.string().required().label('valor total sem frete'),
      amountWithShipping: yup.string().required().label('valor total com frete')
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      shippingAddress: {
        address: '',
        number: '',
        complement: '',
        cep: '',
        state: '',
        city: '',
        neighborhood: ''
      },
      shippingMethod: {
        id: '',
        name: '',
        price: ''
      },
      billingType: 'creditcard',
      checkoutForm: {
        cardholderName: '',
        cardholderEmail: account.email ? account.email : '',
        cardNumber: '',
        cardExpirationDate: '',
        securityCode: '',
        issuer: '',
        identificationType: '',
        identificationNumber: '',
        installments: '',
        cardTokenId: ''
      },
      originalAmount: total.toString(),
      amountWithShipping: ''
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = methods

  const cep = watch('shippingAddress.cep')
  const shippingMethod = watch('shippingMethod')

  const totalToPay = watch('amountWithShipping')
    ? watch('amountWithShipping')
    : parseFloat(total) + parseFloat(selectedShippingPrice)
  const price = (product) => `R$${parseFloat(product.product.price).toFixed(2).replace('.', ',')}`
  const priceSale = (product) => `R$${parseFloat(product.price).toFixed(2).replace('.', ',')}`

  useEffect(() => {
    setValue('amountWithShipping', parseFloat(total) + parseFloat(selectedShippingPrice))
  }, [selectedShippingPrice])

  useEffect(() => {
    setValue('originalAmount', total.toString())
  }, [total])

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
        const data = res.data
        console.log(res)
        setValue('shippingAddress.address', nullToString(data.address))
        setValue('shippingAddress.number', nullToString(data.addressNumber))
        setValue('shippingAddress.complement', nullToString(data.complement))
        setValue('shippingAddress.cep', nullToString(data.postalCode))
        setValue('shippingAddress.state', nullToString(data.uf))
        setValue('shippingAddress.city', nullToString(data.city))
        setValue('shippingAddress.neighborhood', nullToString(data.province))
        dispatch(
          saveAddress({
            street: nullToString(data.address),
            number: nullToString(data.addressNumber),
            complement: nullToString(data.complement),
            zipcode: nullToString(data.postalCode),
            state: nullToString(data.uf),
            city: nullToString(data.city),
            neighborhood: nullToString(data.province)
          })
        )
      })
      .catch((e) => {
        console.log(e)
      })
  }, [dispatch])

  useEffect(() => {
    getUserData()
    getAddressData()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (Object.keys(account).length === 0) {
        router.push('/')
      }
    }, 2000)
  }, [account])

  async function onSubmit(data) {
    const res = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      ...data,
      cart,
      account,
      accountAddress
    })

    if (res.status == 401) {
      router.push('/login')
    }

    const resData = res.data
  }

  useEffect(() => {
    setTimeout(() => {
      if (total == 0) {
        router.push('/')
      }
    }, 3000)
  }, [total])

  return (
    <FormProvider {...methods}>
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
            <form id="form-checkout" onSubmit={handleSubmit(onSubmit)}>
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
                          placeholder="Endereço de entrega"
                          {...register('shippingAddress.address')}
                          id="address"
                          name="address"
                          autoComplete="street-address"
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                        />
                        <ErrorComponent errors={errors['shippingAddress']} name="address" />
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
                          type="text"
                          placeholder="Número"
                          id="number"
                          {...register('shippingAddress.number')}
                          name="number"
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                        />
                        <ErrorComponent errors={errors['shippingAddress']} name="number" />
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
                          placeholder="Complemento"
                          id="complement"
                          {...register('shippingAddress.complement')}
                          name="complement"
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                        />
                        <ErrorComponent errors={errors['shippingAddress']} name="complement" />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="postal-code"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Bairro
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          placeholder="Bairro"
                          id="neighborhood"
                          name="neighborhood"
                          {...register('shippingAddress.neighborhood')}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                        />
                        <ErrorComponent errors={errors['shippingAddress']} name="neighborhood" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        Cidade
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          placeholder="Cidade"
                          id="city"
                          name="city"
                          {...register('shippingAddress.city')}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                        />
                        <ErrorComponent errors={errors['shippingAddress']} name="city" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                        Estado
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          placeholder="Estado"
                          id="state"
                          name="state"
                          {...register('shippingAddress.state')}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                        />
                        <ErrorComponent errors={errors['shippingAddress']} name="state" />
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
                          placeholder="CEP"
                          id="cep"
                          name="cep"
                          {...register('shippingAddress.cep')}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:text-sm"
                        />
                        <ErrorComponent errors={errors['shippingAddress']} name="cep" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <ShippingContent cep={cep} errors={errors} shippingMethod={shippingMethod} />
                </div>
                <div className="mt-5">
                  <Tabs errors={errors} />
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
    </FormProvider>
  )
}
