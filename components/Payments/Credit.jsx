import { useRef, useEffect, useState, useCallback, useContext } from 'react'
import { useSelector } from 'react-redux'
import { CheckoutContext } from '../../contexts/CheckoutContext'
import { getCartState, getCartTotal } from '../../store/selectors/products'
import { getAccount } from '../../store/selectors/user'

function Credit() {
  const account = useSelector(getAccount)
  const cart = useSelector(getCartState)
  const total = useSelector(getCartTotal)
  const installments = useRef(null)
  const emailInputRef = useRef(null)
  const nameInputRef = useRef(null)
  const cpfInputRef = useRef(null)

  const {
    setPaymentRes,
    mp,
    current,
    setLoaded,
    setMp,
    setMpState,
    mpState,
    cardForm,
    setCardForm
  } = useContext(CheckoutContext)

  useEffect(() => {
    if (installments.current[0]) {
      installments.current[0].innerText = 'Selecionar parcelas'
    }
  }, [])

  useEffect(() => {
    if (account) {
      if (account.name && nameInputRef) {
        nameInputRef.current.value = account.name
      }
      if (account.email && emailInputRef) {
        emailInputRef.current.value = account.email
      }
      if (account.cpf && cpfInputRef) {
        cpfInputRef.current.value = account.cpf
      }
    }
  }, [account])

  const [issuer, setIssuer] = useState(null)

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
  }, [mp, setMp])

  useEffect(() => {
    loadMercadoPago(async () => {
      setLoaded(true)
      mpRun()
    })
  }, [mpRun])

  const mountCardForm = useCallback(() => {
    if (mp && !cardForm) {
      const cardFormInstance = mp.cardForm({
        amount: total.toString(),
        autoMount: true,
        processingMode: 'aggregator',
        form: {
          id: 'form-checkout',
          cardholderName: {
            id: 'form-checkout__cardholderName',
            placeholder: 'Nome impresso no cartão'
          },
          cardholderEmail: {
            id: 'form-checkout__cardholderEmail',
            placeholder: 'E-mail'
          },
          cardNumber: {
            id: 'form-checkout__cardNumber',
            placeholder: 'Número do cartão'
          },
          cardExpirationDate: {
            id: 'form-checkout__cardExpirationDate',
            placeholder: 'Data de vencimento (MM/YYYY)'
          },
          securityCode: {
            id: 'form-checkout__securityCode',
            placeholder: 'CVV'
          },
          installments: {
            id: 'form-checkout__installments',
            placeholder: 'Parcelamentos'
          },
          identificationType: {
            id: 'form-checkout__identificationType',
            placeholder: 'Tipo de documento'
          },
          identificationNumber: {
            id: 'form-checkout__identificationNumber',
            placeholder: 'Número do documento'
          },
          issuer: {
            id: 'form-checkout__issuer',
            placeholder: 'Bandeira'
          }
        },
        callbacks: {
          onFormMounted: (error) => {
            if (error) return console.warn('Form Mounted handling error: ', error)
            console.log('Form mounted')
          },

          onFormUnmounted: (error) => {
            if (error) return console.warn('Form Unmounted handling error: ', error)
            console.log('Form unmounted')
          },
          onIdentificationTypesReceived: (error, identificationTypes) => {
            if (error) return console.warn('identificationTypes handling error: ', error)
            console.log('Identification types available: ', identificationTypes)
          },
          onPaymentMethodsReceived: (error, paymentMethods) => {
            if (error) return console.warn('paymentMethods handling error: ', error)
            console.log('Payment Methods available: ', paymentMethods)

            setIssuer(paymentMethods[0])
          },
          onIssuersReceived: (error, issuers) => {
            if (error) return console.warn('issuers handling error: ', error)
            console.log('Issuers available: ', issuers)
          },
          onInstallmentsReceived: (error, installments) => {
            if (error) return console.warn('installments handling error: ', error)
            console.log('Installments available: ', installments)
          },
          onCardTokenReceived: (error, token) => {
            if (error) return console.warn('Token handling error: ', error)
            console.log('Token available: ', token)
          },
          onSubmit: (event) => {
            event.preventDefault()
            setLoading(true)

            const {
              paymentMethodId,
              issuerId,
              cardholderEmail,
              amount,
              token,
              installments,
              identificationNumber,
              identificationType
            } = cardFormInstance.getCardFormData()

            fetch('/api/payments', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`
              },
              body: JSON.stringify({
                token,
                cart,
                address,
                account,
                issuer_id: issuerId,
                payment_method_id: paymentMethodId,
                transaction_amount: Number(amount),
                installments: Number(installments),
                payer: {
                  email: cardholderEmail,
                  identification: {
                    type: identificationType,
                    number: identificationNumber
                  }
                }
              })
            })
              .then((res) => res.json())
              .then((res) => {
                router.push(`/status/${res.action}`)
                setPaymentRes(res)
              })
              .catch((res) => {
                router.push(`/status/${res.action}`)
                setPaymentRes(res)
              })
          },
          onFetching: (resource) => {
            console.log('Fetching resource: ', resource, cardForm, cardFormInstance)

            // Animate progress bar
            // const progressBar = document.querySelector('.progress-bar')
            // progressBar.removeAttribute('value')

            // return () => {
            //   progressBar.setAttribute('value', '0')
            // }
          },
          onError: (error, event) => {
            console.log('onError', event, error)
          },
          onValidityChange: (error, field) => {
            if (error) {
              error.forEach((e) => {
                console.log('onValidityChange', `${field}: ${JSON.stringify(e, null, 2)}`)
              })
            }
          },
          onReady: () => {
            console.log('CardForm ready')
          }
        }
      })
      setCardForm(cardFormInstance)
    }
  }, [mp, cardForm, total, setCardForm, setPaymentRes])

  useEffect(() => {
    console.log('i just ran', mp, cardForm, total)
    if (mp && !cardForm) {
      mountCardForm()
    }
  }, [mp, cardForm])

  useEffect(() => {
    if (current === 3) {
      console.log('mounting')
      mountCardForm()
      return true
    }
    if (cardForm) {
      console.log('unmounting')
      cardForm.unmount()
    }
  }, [current])

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
              ref={nameInputRef}
              autoComplete="name"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label
            htmlFor="form-checkout__cardholderName"
            className="block font-medium text-gray-700"
          >
            Email
          </label>
          <div className="mt-1">
            <input
              type="text"
              ref={emailInputRef}
              name="cardholderEmail"
              placeholder="Email"
              id="form-checkout__cardholderEmail"
              autoComplete="email"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label htmlFor="cardNumber" className="block font-medium text-gray-700">
            Número do cartão
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              name="cardNumber"
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
              maxLength={issuer ? issuer.settings[0].security_code['length'] : '4'}
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
              maxLength={issuer ? issuer.settings[0].security_code['length'] : '4'}
              id="form-checkout__securityCode"
              autoComplete="csc"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] sm:"
            />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <select
          name="issuer"
          className="py-2 pl-3 pr-10 font-medium text-left border border-gray-300 rounded-md shadow-sm cursor-default relativebg-white focus:outline-none focus:ring-1 focus:ring-[#0080A8] focus:border-[#0080A8]"
          id="form-checkout__issuer"
        />
        <select
          name="identificationType"
          id="form-checkout__identificationType"
          className="py-2 pl-3 pr-10 font-medium text-left border border-gray-300 rounded-md shadow-sm cursor-default relativebg-white focus:outline-none focus:ring-1 focus:ring-[#0080A8] focus:border-[#0080A8]"
        />
        <input
          type="text"
          name="identificationNumber"
          placeholder="xxx.xxx.xxx-xx"
          ref={cpfInputRef}
          id="form-checkout__identificationNumber"
          className="ml-2 py-2 border-gray-300 rounded-md shadow-sm focus:ring-[#0080A8] focus:border-[#0080A8] "
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
          id="form-checkout__submit"
          className="bg-[#0080a8] border border-transparent uppercase rounded-md shadow-sm py-2 px-4  font-medium text-white hover:bg-[#0080a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-[#0080A8]"
        >
          Finalizar Pedido
        </button>
      </div>
    </div>
  )
}

export default Credit
