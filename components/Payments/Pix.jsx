import { useEffect, useCallback, useContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { CheckoutContext } from '../../contexts/CheckoutContext'
import { getAccount } from '../../store/selectors/user'
import InputMask from 'react-input-mask'
import debounce from 'lodash.debounce'
import { useFormContext } from 'react-hook-form'

export default function Pix({ errors }) {
  const { setValue, getValues } = useFormContext() // retrieve all hook methods
  const account = useSelector(getAccount)

  const context = useContext(CheckoutContext)

  const {
    mp,
    setLoaded,
    setMp,
    setMpState,
    mpState,
    checkoutForm,
    setCheckoutForm,
    identificationTypes,
    setIdentificationTypes
  } = context

  useEffect(() => {
    const values = getValues()
    if (
      account &&
      !values.checkoutForm.identificationNumber &&
      !values.checkoutForm.cardholderEmail
    ) {
      setValue('checkoutForm.cardholderEmail', account.email ? account.email : '')
      setValue('checkoutForm.identificationType', account.cpf ? 'CPF' : '')
      setValue('checkoutForm.identificationNumber', account.cpf ? account.cpf : '')
    }
  }, [account])

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

  const mpRun = useCallback(() => {
    const mpInstance = new MercadoPago(process.env.NEXT_PUBLIC_PUBLIC_KEY, {
      locale: 'pt-BR'
    })

    setMp(mpInstance)

    setMpState({ ...mpState })
  }, [])

  useEffect(() => {
    loadMercadoPago(() => {
      setLoaded(true)
      mpRun()
    })
  }, [mpRun])

  async function mountIdentificationTypes() {
    if (mp) {
      const identificationTypes = await mp.getIdentificationTypes()
      setIdentificationTypes(identificationTypes)
      if (identificationTypes.length > 0) {
        setValue('checkoutForm.identificationType', identificationTypes[0].id)
      } else {
        setValue('checkoutForm.identificationType', 'CPF')
      }
    }
  }

  function handleChange(e) {
    let value = e.target.value
    let name = e.target.name

    if (name == 'cardHolderName') {
      value = value.toUpperCase()
    }

    setCheckoutForm({
      ...checkoutForm,
      [name]: value
    })

    setValue(`checkoutForm.${name}`, value)
  }

  const debouncedChangeHandler = useMemo((e) => debounce(handleChange, 500), [checkoutForm])

  useEffect(() => {
    mountIdentificationTypes()
  }, [mp])
  return (
    <div className="mt-5">
      <h2 className="text-base font-semibold text-black">
        O código do PIX para o pagamento será exibido na próxima tela após Finalizar Pedido abaixo
      </h2>
      <ul className="mt-2 sm:ml-8">
        <li className="mb-2"> Pague via PIX e receba 12% de desconto</li>
        <li className="mb-2"> Pague em qualquer horário pelo celular</li>
        <li> O pagamento é instantâneo e pode ser feito em poucos segundos de forma segura</li>
      </ul>
      <div>
        <select
          name="identificationType"
          id="form-checkout__identificationType"
          onChange={debouncedChangeHandler}
          disabled={identificationTypes.length === 0}
          className={`py-2 pl-3 pr-10 ${
            identificationTypes.length === 0 && 'bg-none appearance-none'
          } font-medium text-left border border-gray-300 rounded-md shadow-sm cursor-default relativebg-white focus:outline-none focus:ring-1 focus:ring-[#0080A8] focus:border-[#0080A8]`}
        >
          {identificationTypes.map((idtype) => {
            return (
              <option key={idtype.id} value={idtype.id}>
                {idtype.name}
              </option>
            )
          })}
        </select>
        <InputMask
          mask={checkoutForm.identificationType == 'CNPJ' ? '99.999.999/9999-99' : '999.999.999-99'}
          maskChar=" "
          type="text"
          // value={getValues('checkoutForm.identificationNumber')}
          name="identificationNumber"
          placeholder={
            checkoutForm.identificationType == 'CNPJ' ? 'xx.xxx.xxx/xxxx-xx' : 'xxx.xxx.xxx-xx'
          }
          onChange={debouncedChangeHandler}
          // value={checkoutForm.identificationNumber}
          id="form-checkout__identificationNumber"
          className="ml-1 py-2 border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] "
        />
      </div>
    </div>
  )
}
