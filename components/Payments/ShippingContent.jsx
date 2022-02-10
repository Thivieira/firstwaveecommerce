import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CheckoutContext } from '../../contexts/CheckoutContext'
import { getCartState } from '../../store/selectors/products'

function ShippingContent({ cep }) {
  const { shipping, setShipping, selectedShipping, setSelectedShipping, setSelectedShippingPrice } =
    useContext(CheckoutContext)

  const cart = useSelector(getCartState)

  useEffect(() => {
    if (cep && cart.length > 0) {
      const width = cart
        .map((el) => parseInt(el.width, 10))
        .reduce((previousValue, currentValue) => previousValue + currentValue)

      const height = cart
        .map((el) => parseInt(el.height, 10))
        .reduce((previousValue, currentValue) => previousValue + currentValue)

      const length = cart
        .map((el) => parseInt(el.length, 10))
        .reduce((previousValue, currentValue) => previousValue + currentValue)

      const weight = cart
        .map((el) => parseInt(el.netWeight, 10))
        .reduce((previousValue, currentValue) => previousValue + currentValue)

      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/integrations/melhorenvio/shipping/calculate`, {
          postal_code: cep,
          width,
          height,
          length,
          weight
        })
        .then((res) => setShipping(res.data))
    }
  }, [cart, cep, setShipping])

  return (
    <div className="relative max-w-xl mx-auto border-b border-gray-200 sm:pb-0 lg:max-w-5xl">
      <div className="max-w-md mx-auto sm:max-w-3xl lg:max-w-7xl">
        <h2 className="text-2xl font-bold text-[#0080A8]">Escolha a forma de entrega</h2>
        <div className="shipping-calculator">
          {shipping.length > 0 && (
            <div>
              {shipping
                .filter((el) => !el.error)
                .map((el, i) => (
                  <div className="radio" key={i}>
                    <input
                      type="radio"
                      name={el.name}
                      id={el.name}
                      value={el.name}
                      onChange={(e) => {
                        setSelectedShipping(e.target.value)
                        setSelectedShippingPrice(el.price)
                      }}
                      checked={selectedShipping === el.name}
                    />
                    <label htmlFor={el.name} className="radio-label">
                      <div className="shipping-result">
                        <span>{el.name}</span>
                        <p>R${el.price.replace('.', ',')}</p>
                        <p>Em até {el.delivery_time} dias úteis</p>
                      </div>
                    </label>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShippingContent
