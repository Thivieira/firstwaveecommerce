import { useRef, useEffect, useState, useCallback, useContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { CheckoutContext } from '../../contexts/CheckoutContext'
import { getCartState, getCartTotal } from '../../store/selectors/products'
import { getAccount } from '../../store/selectors/user'
import InputMask from 'react-input-mask'
import debounce from 'lodash.debounce'
import { ErrorComponent } from '../../pages/checkout'
import { useFormContext } from 'react-hook-form'

function Credit({ errors }) {
  const { setValue, getValues } = useFormContext() // retrieve all hook methods
  const account = useSelector(getAccount)
  const cart = useSelector(getCartState)
  const total = useSelector(getCartTotal)

  const context = useContext(CheckoutContext)

  const {
    mp,
    current,
    setLoaded,
    setMp,
    setMpState,
    mpState,
    checkoutForm,
    setCheckoutForm,
    identificationTypes,
    setIdentificationTypes,
    paymentMethods,
    setPaymentMethods,
    installments,
    setInstallments,
    cardToken,
    setCardToken,
    issuer,
    setIssuer
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
      // setCheckoutForm({
      //   ...checkoutForm,
      //   // cardholderName: account.name ? account.name : '',
      //   cardholderEmail: ,
      //   identificationNumber: account.cpf ? account.cpf : ''
      // })
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

  const mpRun = useCallback(async () => {
    const mpInstance = new MercadoPago(process.env.NEXT_PUBLIC_PUBLIC_KEY, {
      locale: 'pt-BR'
    })

    setMp(mpInstance)

    setMpState({ ...mpState })
  }, [])

  useEffect(() => {
    loadMercadoPago(async () => {
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
        // setCheckoutForm({ ...checkoutForm, identificationType: identificationTypes[0].id })
      } else {
        setValue('checkoutForm.identificationType', 'CPF')
        // setCheckoutForm({ ...checkoutForm, identificationType: 'CPF' })
      }
    }
  }

  async function mountForm() {
    if (mp) {
      const values = getValues()
      console.log(values.checkoutForm.cardNumber, 'hi there')
      if (values.checkoutForm.cardNumber) {
        const cardNumber = values.checkoutForm.cardNumber.replace(/\s/g, '')
        const bin = cardNumber.substr(0, 6)
        const cardExpirationDate = values.checkoutForm.cardExpirationDate
          ? values.checkoutForm.cardExpirationDate.replace(/[^a-z^0-9]+/g, ' ').replace(/\s/g, '')
          : ''
        const month = cardExpirationDate.substr(0, 2)
        const year = cardExpirationDate.substr(2, 6)
        const identificationNumber = values.checkoutForm.identificationNumber
          ? values.checkoutForm.identificationNumber.replace(/[^a-z^0-9]+/g, ' ').replace(/\s/g, '')
          : ''

        setValue('checkoutForm.identificationNumber', identificationNumber)
        // setCheckoutForm({ ...checkoutForm, identificationNumber })

        const paymentMethods = await mp.getPaymentMethods({ bin })

        setPaymentMethods(paymentMethods.results)

        setIssuer(paymentMethods.results[0])
        setValue('checkoutForm.issuer', paymentMethods.results[0].id)
        // setCheckoutForm({ ...checkoutForm, issuer: paymentMethods.results[0].id })

        if (total && bin) {
          const installments = await mp.getInstallments({
            amount: total.toString(),
            locale: 'pt-BR',
            bin,
            processingMode: 'aggregator'
          })

          setInstallments(installments)
          if (installments.length > 0) {
            setValue('checkoutForm.installments', installments[0].payer_costs[0].installments)
            // setCheckoutForm({
            //   ...checkoutForm,
            //   installments: installments[0].payer_costs[0].installments
            // })
          } else {
            setValue('checkoutForm.installments', '1')
            // setCheckoutForm({ ...checkoutForm, installments: '1' })
          }
        }

        console.log(
          {
            cardNumber,
            cardholderName: values.checkoutForm.cardholderName,
            month,
            year,
            securityCode: values.checkoutForm.securityCode,
            identificationType: values.checkoutForm.identificationType,
            identificationNumber,
            cardExpirationDate,
            condition:
              cardNumber &&
              values.checkoutForm.cardholderName &&
              month &&
              year &&
              values.checkoutForm.securityCode &&
              values.checkoutForm.identificationType &&
              identificationNumber
          },
          'THE MOST IMPORTANT'
        )
        if (
          cardNumber &&
          values.checkoutForm.cardholderName &&
          month &&
          year &&
          values.checkoutForm.securityCode &&
          values.checkoutForm.identificationType &&
          identificationNumber
        ) {
          const cardToken = await mp.createCardToken({
            cardNumber: cardNumber,
            cardholderName: values.checkoutForm.cardholderName,
            cardExpirationMonth: month,
            cardExpirationYear: year,
            securityCode: values.checkoutForm.securityCode,
            identificationType: values.checkoutForm.identificationType,
            identificationNumber: identificationNumber
          })

          setCardToken(cardToken)

          setValue('checkoutForm.cardTokenId', cardToken.id)
          // setCheckoutForm({ ...checkoutForm, cardTokenId: cardToken.id })
        }
      }
    }
  }

  function handleChange(e) {
    let value = e.target.value
    let name = e.target.name

    if (name == 'cardHolderName') {
      value = value.toUpperCase()
    }

    console.log({
      ...checkoutForm,
      [name]: value
    })
    setCheckoutForm({
      ...checkoutForm,
      [name]: value
    })

    console.log(`checkoutForm.${name}`, value)

    setValue(`checkoutForm.${name}`, value)
  }

  const debouncedChangeHandler = useMemo((e) => debounce(handleChange, 1000), [checkoutForm])

  useEffect(() => {
    if (current === 3) {
      mountIdentificationTypes()
    }
  }, [mp])

  useEffect(() => {
    if (current === 3) {
      mountIdentificationTypes()
    }
  }, [current, mp])

  useEffect(async () => {
    if (current == 3) {
      await mountForm()
      return true
    }
  }, [checkoutForm, total])

  return (
    <div className="mt-5">
      <div className="grid mt-3 sm:grid-cols-2 gap-y-3 gap-x-4">
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
              onChange={debouncedChangeHandler}
              // value={getValues('checkoutForm.cardholderName')}
              // value={checkoutForm.cardholderName}
              autoComplete="name"
              className="block uppercase w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:"
            />
          </div>
          <ErrorComponent errors={errors['checkoutForm']} name="cardholderName" />
        </div>

        <div className="hidden col-span-3">
          <label
            htmlFor="form-checkout__cardholderName"
            className="hidden font-medium text-gray-700"
          >
            Email
          </label>
          <div className="mt-1">
            <input
              type="text"
              onChange={debouncedChangeHandler}
              // value={checkoutForm.cardholderEmail}
              name="cardholderEmail"
              placeholder="Email"
              id="form-checkout__cardholderEmail"
              // value={getValues('checkoutForm.cardholderEmail')}
              autoComplete="email"
              className=" hidden w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:"
            />
          </div>
          {/* <ErrorComponent errors={errors['checkoutForm']} name="cardholderEmail" /> */}
        </div>

        <div className="col-span-3">
          <label htmlFor="cardNumber" className="block font-medium text-gray-700">
            Número do cartão
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              name="cardNumber"
              onChange={debouncedChangeHandler}
              // value={checkoutForm.cardNumber}
              // value={getValues('checkoutForm.cardNumber')}
              placeholder="Número do cartão"
              id="form-checkout__cardNumber"
              maxLength="19"
              autoComplete="cc-number"
              className={`block ${
                issuer && 'pr-14'
              } w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] `}
            />
            {issuer && (
              <img
                className="absolute object-cover w-10 h-8 transform -translate-y-1/2 pointer-events-none top-1/2 right-3"
                title={issuer.issuer.name}
                alt={issuer.issuer.name}
                src={issuer.thumbnail}
              />
            )}
          </div>
          <ErrorComponent errors={errors['checkoutForm']} name="cardNumber" />
        </div>
      </div>

      <div className="grid grid-cols-2 mt-3 gap-y-3 gap-x-4">
        <div className="">
          <label htmlFor="cardExpirationDate" className="block font-medium text-gray-700">
            Validade (MM/YYYY)
          </label>
          <div className="mt-1">
            <InputMask
              mask="99/9999"
              maskChar=" "
              name="cardExpirationDate"
              onChange={debouncedChangeHandler}
              // value={getValues('checkoutForm.cardExpirationDate')}
              // value={checkoutForm.cardExpirationDate}
              type="text"
              placeholder="Data de vencimento"
              name="cardExpirationDate"
              id="form-checkout__cardExpirationDate"
              autoComplete="cc-exp"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:"
            />
          </div>
          <ErrorComponent errors={errors['checkoutForm']} name="cardExpirationDate" />
        </div>

        <div className="">
          <label htmlFor="securityCode" className="block font-medium text-gray-700">
            Código de seguraça
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="securityCode"
              onChange={debouncedChangeHandler}
              placeholder="Código de seguraça"
              // value={getValues('checkoutForm.securityCode')}
              // value={checkoutForm.securityCode}
              maxLength={issuer ? issuer.settings[0].security_code['length'] : '4'}
              id="form-checkout__securityCode"
              autoComplete="csc"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:"
            />
          </div>
          <ErrorComponent errors={errors['checkoutForm']} name="securityCode" />
        </div>
      </div>

      <div className="mt-3">
        <select
          name="issuer"
          className={`bg-none hidden py-2 pl-3 pr-10 font-medium text-left border border-gray-300 rounded-md shadow-sm cursor-default relativebg-white focus:outline-none focus:ring-1 focus:ring-[#0080A8] focus:border-[#0080A8]`}
          id="form-checkout__issuer"
          onChange={debouncedChangeHandler}
          // value={getValues('checkoutForm.issuer')}
          // value={checkoutForm.issuer}
          disabled
        >
          {issuer && <option value={issuer.id}>{issuer.name}</option>}
        </select>
        {/* <ErrorComponent errors={errors['checkoutForm']} name="issuer" /> */}
        <select
          name="identificationType"
          id="form-checkout__identificationType"
          onChange={debouncedChangeHandler}
          // value={getValues('checkoutForm.identificationType')}
          // value={checkoutForm.identificationType}
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
        <select
          name="installments"
          onChange={debouncedChangeHandler}
          // value={checkoutForm.installments}
          // value={getValues('checkoutForm.installments')}
          id="form-checkout__installments"
          disabled={installments.length === 0}
          className={`py-2 pl-3 pr-10 ml-2 mt-5 ${
            installments.length === 0 && 'bg-none appearance-none'
          } font-medium text-left border border-gray-300 rounded-md shadow-sm cursor-default relativebg-white focus:outline-none focus:ring-1 focus:ring-[#0080A8] focus:border-[#0080A8]`}
        >
          {installments.length > 0 &&
            installments[0].payer_costs.map((ins) => {
              return (
                <option key={ins.installments} value={ins.installments}>
                  {ins.recommended_message}
                </option>
              )
            })}
          {installments.length === 0 && (
            <option value="null">
              Opções de parcelamento (digite o número do cartão primeiro)
            </option>
          )}
        </select>
      </div>
      <div className="flex flex-col justify-center">
        <ErrorComponent errors={errors['checkoutForm']} name="identificationType" />
        <ErrorComponent errors={errors['checkoutForm']} name="identificationNumber" />
        <ErrorComponent errors={errors} name="installments" />
      </div>
    </div>
  )
}

export default Credit
