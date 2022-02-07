import { BarcodeOutlined } from '@ant-design/icons'
import { CreditCard } from '@material-ui/icons'
import { useState } from 'react'
import Credit from './Credit'
import Pix from './Pix'
import Ticket from './Ticket'

export default function TabSolutions() {
  const [current, setCurrent] = useState(1)

  const tabs = [
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
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <>
      <div className="relative max-w-xl mx-auto border-b border-gray-200 sm:pb-0 lg:max-w-5xl">
        <div className="max-w-md mx-auto sm:max-w-3xl lg:max-w-7xl">
          <h2 className="text-2xl font-bold text-[#0080A8]">Escolha a Forma de pagamento</h2>
        </div>
        <div className="mt-6">
          <div className="sm:hidden">
            <select
              id="current-tab"
              name="current-tab"
              className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              defaultValue={tabs.find((tab) => tab.id === current).name}
            >
              {tabs.map((tab) => (
                <option key={tab.id}>{tab.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex -mb-px space-x-8">
              {tabs.map((tab) => (
                <span
                  key={tab.name}
                  className={classNames(
                    tab.id == current
                      ? 'border-black text-black '
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap pb-4 px-1 text-md border-b-2 flex items-center font-bold text-base  cursor-pointer'
                  )}
                  onClick={() => setCurrent(tab.id)}
                >
                  {tab.icon}
                  {tab.name}
                </span>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {current === 1 ? <Ticket /> : current === 2 ? <Pix /> : current === 3 && <Credit />}
    </>
  )
}
