import axios from 'axios'
import { useState } from 'react'
import NavLink from '../NavLink'

export default function ShippingCalculator({ product }) {
  const [cep, setCep] = useState('')
  console.log(process.env.API_URL)

  const calculate = () => {
    axios
      .post(`${process.env.API_URL}/integrations/melhorenvio/shipping/calculate`, {
        postal_code: cep,
        width: product.width,
        height: product.height,
        length: product.length,
        weight: product.netWeight
      })
      .then((res) => console.log(res))
  }

  return (
    <div className="shipping-calculator">
      <h3>Calcule o frete e prazo de entrega</h3>

      <div className="shipping-calculator-actions">
        <input
          type="number"
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
    </div>
  )
}
