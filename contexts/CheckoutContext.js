import { BarcodeOutlined } from '@ant-design/icons'
import { CreditCard } from '@material-ui/icons'
import { createContext, useState } from 'react'

export const CheckoutContext = createContext()

function CheckoutContextProvider(props) {
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(3)
  const [paymentRes, setPaymentRes] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [mp, setMp] = useState(null)
  const [mpState, setMpState] = useState({})
  const [cardForm, setCardForm] = useState(null)
  const [shipping, setShipping] = useState([])
  const [selectedShipping, setSelectedShipping] = useState('')
  const [selectedShippingPrice, setSelectedShippingPrice] = useState(0)
  const [checkoutForm, setCheckoutForm] = useState({
    cardholderName: '',
    cardholderEmail: '',
    cardNumber: '',
    cardExpirationDate: '',
    securityCode: '',
    issuer: '',
    identificationType: '',
    identificationNumber: '',
    installments: '',
    cardTokenId: '',
    billingType: 'creditcard'
  })
  const [identificationTypes, setIdentificationTypes] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [issuer, setIssuer] = useState(null)
  const [installments, setInstallments] = useState([])
  const [cardToken, setCardToken] = useState({})

  const [tabs, setTabs] = useState([
    {
      id: 1,
      title: 'Boleto',
      name: 'ticket',
      icon: <BarcodeOutlined className="pt-1" style={{ fontSize: '1.5rem' }} />
    },
    {
      id: 2,
      title: 'Pix',
      name: 'pix',
      icon: <img src="/pix.svg" className="w-5 h-5" alt="pix" />
    },
    {
      id: 3,
      title: 'Cartão de crédito',
      name: 'creditcard',
      icon: <CreditCard style={{ height: '2rem !important', marginTop: '0.3rem' }} />
    }
  ])

  return (
    <CheckoutContext.Provider
      value={{
        loading,
        setLoading,
        loaded,
        setLoaded,
        mp,
        setMp,
        mpState,
        setMpState,
        cardForm,
        setCardForm,
        current,
        setCurrent,
        tabs,
        setTabs,
        paymentRes,
        setPaymentRes,
        shipping,
        setShipping,
        selectedShipping,
        setSelectedShipping,
        selectedShippingPrice,
        setSelectedShippingPrice,
        checkoutForm,
        setCheckoutForm,
        identificationTypes,
        setIdentificationTypes,
        paymentMethods,
        setPaymentMethods,
        installments,
        setInstallments,
        issuer,
        setIssuer,
        cardToken,
        setCardToken
      }}
    >
      {props.children}
    </CheckoutContext.Provider>
  )
}

export default CheckoutContextProvider
