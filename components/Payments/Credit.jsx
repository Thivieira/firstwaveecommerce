import { useSelector } from 'react-redux'
import { getAccount } from '../../store/selectors/user'

function Credit() {
  const account = useSelector(getAccount)
  return (
    <div className="mt-5">
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
          <label htmlFor="cardExpirationDate" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="securityCode" className="block text-sm font-medium text-gray-700">
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
        <select
          name="identificationType"
          id="form-checkout__identificationType"
          defaultValue={'CPF'}
        />
        <input
          type="text"
          name="identificationNumber"
          id="form-checkout__identificationNumber"
          value={account.cpf}
        />
        <select name="installments" id="form-checkout__installments" />
      </div>

      <div className="flex justify-start pt-6 mt-10 border-t border-gray-200">
        <button
          type="submit"
          className="bg-[#0080a8] border border-transparent uppercase rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-[#0080a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-[#0080A8]"
        >
          Finalizar Pedido
        </button>
        {/* <progress value="0" className="progress-bar">
          Carregando...
        </progress> */}
      </div>
    </div>
  )
}

export default Credit
