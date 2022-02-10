/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import withReactContent from 'sweetalert2-react-content'

import Swal from 'sweetalert2'
import { getCartState, getCartTotal, getIsOpen } from '../../store/selectors/products'
import useCart from '../../contexts/CartStorage'
import useToken from '../../contexts/TokenStorage'
import { changeIsOpen, updateCart } from '../../store/actions/products'
import CartProduct from './CartProduct'

export default function Cart() {
  const dispatch = useDispatch()

  const router = useRouter()

  const isOpen = useSelector(getIsOpen)

  const cart = useSelector(getCartState)
  const total = useSelector(getCartTotal)

  const [cartStorage, setCartStorage] = useCart('cart')

  const MySwal = withReactContent(Swal)

  const [token] = useToken()

  const closeFloatCart = () => dispatch(changeIsOpen(false))

  useEffect(() => {
    setCartStorage({ cart, total })
  }, [cart, setCartStorage, total])

  useEffect(() => {
    dispatch(updateCart({ cart: cartStorage.cart, total: cartStorage.total }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const noAuthorized = () => {
    closeFloatCart()
    if (total === 0) {
      MySwal.fire({
        title: <p>Carrinho está vazio!</p>,
        confirmButtonText: 'OK'
      })
    } else {
      MySwal.fire({
        title: <p>Faça login ou cadastre-se antes de finalizar no carrinho</p>,
        confirmButtonText: 'OK'
      }).then((res) => {
        if (res.isConfirmed) {
          router.push('/login')
        }
      })
    }
  }

  const authorizedCart = () => {
    closeFloatCart()
    if (total === 0) {
      MySwal.fire({
        title: <p>Carrinho está vazio!</p>,
        confirmButtonText: 'OK'
      })
    } else {
      router.push('/checkout')
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 overflow-hidden"
        style={{ zIndex: 9999 }}
        open={isOpen}
        onClose={closeFloatCart}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0 transition-opacity bg-gray-500 bg-opacity-75" />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-md">
                <div className="flex flex-col h-full bg-[#1B1A20] divide-y divide-gray-800 shadow-xl">
                  <div className="flex flex-col flex-1 min-h-0 py-6">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-xl font-medium text-white">
                          Carrinho
                        </Dialog.Title>
                        <div className="flex items-center ml-3 h-7">
                          <button
                            className="text-white  bg-transparent rounded-md hover:text-[#ffa500] focus:outline-none "
                            onClick={closeFloatCart}
                            type="button"
                          >
                            <XIcon className="w-6 h-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex-1 px-4 mt-6 overflow-y-auto">
                      <div className="h-full" aria-hidden="true">
                        <div className="float-cart__shelf-container">
                          {cart.map((pv) => (
                            <CartProduct product_variation={pv} key={pv.external_id} />
                          ))}

                          {cart.length === 0 && (
                            <p className="shelf-empty">Adicione algum produto no carrinho</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end flex-shrink-0 px-4 py-4">
                    <div className="flex justify-between pb-4 text-xl text-white">
                      <span>TOTAL</span>

                      <div className="flex flex-col text-right">
                        <p className="text-[#ffa500]">{`R$${total
                          .toFixed(2)
                          .replace('.', ',')}`}</p>
                        {cart.length > 0 && (
                          <span className="flex justify-end text-sm font-normal text-white">
                            {`6x de R$${(total / 6)
                              .toFixed(2)
                              .replace(
                                '.',
                                ','
                              )} sem juros no cartão ou 12% de desconto no boleto e pix`}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      className="px-2 py-2 text-base font-normal text-white bg-black rounded cursor-pointer hover:bg-gray-800"
                      onClick={token ? authorizedCart : noAuthorized}
                      type="button"
                    >
                      Finalizar compra
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
