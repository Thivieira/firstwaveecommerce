import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getAccount } from '../../store/selectors/user'

function Credit() {
  const account = useSelector(getAccount)
  const installments = useRef(null)

  useEffect(() => {
    if (installments.current[0]) {
      installments.current[0].innerText = 'Selecionar parcelas'
    }
  }, [])

  return (
    <div className="mt-5">
      <div className="grid mt-6 sm:grid-cols-2 gap-y-6 gap-x-4">
        <div className="col-span-3">
          <label
            htmlFor="form-checkout__cardholderName"
            className="block font-medium text-gray-700"
          >
            Nome impresso no cartão
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="cardholderName"
              placeholder="Nome impresso no cartão"
              id="form-checkout__cardholderName"
              autoComplete="name"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label htmlFor="cardNumber" className="block font-medium text-gray-700">
            Número do cartão
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="cardNumber"
              placeholder="Número do cartão"
              id="form-checkout__cardNumber"
              autoComplete="cc-number"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 mt-6 gap-y-6 gap-x-4">
        <div className="">
          <label htmlFor="cardExpirationDate" className="block font-medium text-gray-700">
            Validade (MM/YYYY)
          </label>
          <div className="mt-1">
            <input
              type="text"
              maxLength="7"
              placeholder="Data de vencimento"
              name="cardExpirationDate"
              id="form-checkout__cardExpirationDate"
              autoComplete="cc-exp"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:"
            />
          </div>
        </div>

        <div className="">
          <label htmlFor="securityCode" className="block font-medium text-gray-700">
            Código de seguraça
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="securityCode"
              id="form-checkout__securityCode"
              autoComplete="csc"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:"
            />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <select name="issuer" id="form-checkout__issuer" className="hidden" />
        <select
          name="identificationType"
          id="form-checkout__identificationType"
          defaultValue="CPF"
          className="py-2 pl-3 pr-10 font-medium text-left border border-gray-300 rounded-md shadow-sm cursor-default relativebg-white focus:outline-none focus:ring-1 focus:ring-[#0080A8] focus:border-[#0080A8]"
        />
        <input
          type="text"
          name="identificationNumber"
          placeholder="xxx.xxx.xxx-xx"
          id="form-checkout__identificationNumber"
          className="ml-2 py-2 border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] "
          value={account.cpf}
        />
      </div>

      <select
        name="installments"
        ref={installments}
        id="form-checkout__installments"
        className="py-2 pl-3 pr-10 mt-5 font-medium text-left border border-gray-300 rounded-md shadow-sm cursor-default relativebg-white focus:outline-none focus:ring-1 focus:ring-[#0080A8] focus:border-[#0080A8]"
      />

      <div className="flex justify-start pt-6 mt-10 border-t border-gray-200">
        <button
          type="submit"
          className="bg-[#0080a8] border border-transparent uppercase rounded-md shadow-sm py-2 px-4  font-medium text-white hover:bg-[#0080a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-[#0080A8]"
        >
          Finalizar Pedido
        </button>
      </div>
    </div>
  )
}

export default Credit
