import api from '../../services/api'
import { useRef, useContext, useState, useEffect } from 'react'
import { CheckoutContext } from '../../contexts/CheckoutContext'
import NavLink from '../NavLink'

export default function ShippingTable({ product }) {
  const [cep, setCep] = useState('')
  const cepRef = useRef(null)

  const { shipping, setShipping } = useContext(CheckoutContext)

  const calculate = () => {
    if (cep) {
      api
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

  useEffect(() => {
    setShipping([])
  }, [product])

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
        <div className="flex flex-col mt-6">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase"
                      >
                        TIPO DE ENTREGA
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase"
                      >
                        VALOR FRETE
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase"
                      >
                        PRAZO DE ENTREGA
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shipping
                      .filter((el) => !el.error)
                      .map((el) => (
                        <tr key={el.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">{el.name}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              R${el.price.replace('.', ',')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 text-xs font-semibold leading-5 text-[#0080a8] bg-green-100 rounded-full">
                              Em até {el.delivery_time} dias úteis
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
