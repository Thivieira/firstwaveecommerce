import { BarcodeOutlined } from '@ant-design/icons'
import { CreditCard } from '@material-ui/icons'
import { createContext, useState } from 'react'

export const CheckoutContext = createContext()

function CheckoutContextProvider(props) {
  const [paymentMethods, setPaymentMethods] = useState([])
  const [current, setCurrent] = useState(3)
  const [paymentRes, setPaymentRes] = useState([])

  const [shipping, setShipping] = useState([])
  const [selectedShipping, setSelectedShipping] = useState('')
  const [selectedShippingPrice, setSelectedShippingPrice] = useState(0)

  const [tabs, setTabs] = useState([
    {
      id: 1,
      name: 'Boleto',
      icon: <BarcodeOutlined className="pt-1" style={{ fontSize: '1.5rem' }} />
    },
    { id: 2, name: 'Pix', icon: <img src="/pix.svg" className="w-5 h-5" alt="pix" /> },
    {
      id: 3,
      name: 'Cartão de crédto',
      icon: <CreditCard style={{ height: '2rem !important', marginTop: '0.3rem' }} />
    }
  ])

  return (
    <CheckoutContext.Provider
      value={{
        paymentMethods,
        setPaymentMethods,
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
        setSelectedShippingPrice
      }}
    >
      {props.children}
    </CheckoutContext.Provider>
  )
}

export default CheckoutContextProvider
