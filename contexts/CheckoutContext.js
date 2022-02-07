import { BarcodeOutlined } from '@ant-design/icons'
import { CreditCard } from '@material-ui/icons'
import { createContext, useState } from 'react'

export const CheckoutContext = createContext()

const CheckoutContextProvider = (props) => {
  const [paymentMethods, setPaymentMethods] = useState([])
  const [current, setCurrent] = useState(3)

  const [tabs, setTabs] = useState([
    {
      id: 1,
      name: 'Boleto',
      icon: <BarcodeOutlined className="w-8 h-8 pt-1 mr-2" style={{ fontSize: '2rem' }} />
    },
    { id: 2, name: 'Pix', icon: <img src="/pix.svg" className="w-8 h-8 mr-2" alt="pix" /> },
    {
      id: 3,
      name: 'Cartão de crédto',
      icon: <CreditCard className="w-8 h-8 mr-2" />
    }
  ])

  return (
    <CheckoutContext.Provider
      value={{ paymentMethods, setPaymentMethods, current, setCurrent, tabs, setTabs }}
    >
      {props.children}
    </CheckoutContext.Provider>
  )
}

export default CheckoutContextProvider
