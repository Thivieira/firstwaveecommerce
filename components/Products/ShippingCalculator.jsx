import axios from 'axios'
import { useState, useRef } from 'react'
import NavLink from '../NavLink'

export default function ShippingCalculator({ product }) {
  const [cep, setCep] = useState('')
  const [shipping, setShipping] = useState([])
  const cepRef = useRef(null)

  const isCEP = (cepFormat) => /^[0-9]{8}$/.test(cepFormat)

  const calculate = () => {
    if (cep) {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/integrations/melhorenvio/shipping/calculate`, {
          postal_code: cep,
          width: product.width,
          height: product.height,
          length: product.length,
          weight: product.netWeight
        })
        .then((res) => setShipping(res.data))
    }
  }

  return (
    <div className="shipping-calculator">
      <h3>Calcule o frete e prazo de entrega</h3>
      <div className="shipping-calculator-actions">
        <input
          ref={cepRef}
          type="text"
          placeholder="insira o seu CEP"
          onChange={(e) => setCep(e.target.value)}
        />
        <button type="button" onClick={() => calculate()}>
          Calcular
        </button>
      </div>
      <NavLink
        className="cepLink"
        target="_blank"
        href="http://www.buscacep.correios.com.br/sistemas/buscacep/buscaCepEndereco.cfm"
      >
        Não sei meu CEP
      </NavLink>

      {shipping.length > 0 && (
        <div style={{ paddingTop: '1rem' }}>
          <h3>Formas de entrega disponíveis</h3>
          {shipping
            .filter((el) => !el.error)
            .map((el) => (
              <div className="radio">
                <input id={el.name} name="radio" type="radio" />
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
  )
}
