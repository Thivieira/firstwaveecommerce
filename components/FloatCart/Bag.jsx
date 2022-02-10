import React from 'react'
import { Badge } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingBagIcon } from '@heroicons/react/outline'

import { getCartState } from '../../store/selectors/products'
import { changeIsOpen } from '../../store/actions/products'

function Bag() {
  const dispatch = useDispatch()
  const cart = useSelector(getCartState)

  const openFloatCart = () => {
    dispatch(changeIsOpen(true))
  }
  const itemQuantity = cart.map((item) => item.quantity).reduce((item, total) => item + total, 0)

  return (
    <span onClick={openFloatCart} className="cursor-pointer ">
      <Badge
        count={itemQuantity}
        className="text-sm"
        style={{ backgroundColor: '#ffa500', fontWeight: '700' }}
      >
        <ShoppingBagIcon className="w-8 h-8 text-[#0080A8]" />
      </Badge>
    </span>
  )
}

export default Bag
