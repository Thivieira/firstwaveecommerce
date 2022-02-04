import NavLink from '../NavLink'

export default function ShippingCalculator() {
  return (
    <div className="shipping-calculator">
      <h3>Calcule o frete e prazo de entrega</h3>

      <div className="shipping-calculator-actions">
        <input type="number" placeholder="insira o seu CEP" />
        <button>Calcular</button>
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
