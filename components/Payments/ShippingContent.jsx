// import api from '../../services/api'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { CheckoutContext } from '../../contexts/CheckoutContext'
import { ErrorComponent } from '../../pages/checkout'
import { getCartState } from '../../store/selectors/products'

function ShippingContent({ cep, errors, shippingMethod }) {
  const { shipping, setShipping, selectedShipping, setSelectedShipping, setSelectedShippingPrice } =
    useContext(CheckoutContext)
  const { setValue } = useFormContext() // retrieve all hook methods

  const cart = useSelector(getCartState)

  useEffect(() => {
    if (cep && cart.length > 0) {
      const shippingData = cart.map((product) => ({
        width: product.width,
        height: product.height,
        length: product['length'],
        weight: product.weight,
        quantity: product.quantity
      }))

      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/integrations/melhorenvio/shipping/calculateCart`,
          {
            postal_code: cep,
            products: shippingData
          }
        )
        .then((res) => setShipping(res.data))
    }
  }, [cart, cep])

  useEffect(() => {
    setShipping([])
  }, [])

  if (!cep) {
    return (
      <div className="relative max-w-xl border-b border-gray-200 sm:pb-0 lg:max-w-5xl">
        <div className="max-w-md mx-auto sm:max-w-3xl lg:max-w-7xl">
          <h2 className="text-2xl font-bold text-[#0080A8]">Escolha a forma de entrega</h2>
          <p className="font-bold">Informe o cep para escolher o frete.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative max-w-xl border-b border-gray-200 sm:pb-0 lg:max-w-5xl">
      <div className="max-w-md sm:mx-auto sm:max-w-3xl lg:max-w-7xl">
        <h2 className="text-2xl font-bold text-[#0080A8]">Escolha a forma de entrega</h2>
        <div className="shipping-calculator">
          {shipping.length > 0 && (
            <div className="block">
              {shipping
                .filter((el) => !el.error)
                .map((el, i) => (
                  <div className="block radio" key={el.id}>
                    <input
                      type="radio"
                      name={'shippingMethod'}
                      id={el.name}
                      value={el.id}
                      onChange={(e) => {
                        setSelectedShipping(e.target.value)
                        setSelectedShippingPrice(el.price)
                        setValue('shippingMethod', {
                          id: el.id,
                          name: el.name,
                          price: el.price
                        })
                      }}
                      checked={shippingMethod?.id === el.id}
                    />
                    <label htmlFor={el.name} className="radio-label">
                      <div className="relative flex items-center justify-center shipping-result">
                        <p className="w-24 pr-2 mb-0 mr-2 sm:w-72">{el.name}</p>
                        <p className="px-2 mx-2 mb-0">R${el.price.replace('.', ',')}</p>
                        <p className="pl-2 mb-0 ml-2">Em até {el.delivery_time} dias úteis</p>
                      </div>
                    </label>
                  </div>
                ))}
            </div>
          )}
          {console.log('errors', errors)}
          <ErrorComponent errors={errors['shippingMethod']} name="id" />
        </div>
      </div>
    </div>
  )
}

export default ShippingContent
