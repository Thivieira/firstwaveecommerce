import React, { useState } from 'react'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { PlusOutlined, MinusOutlined, CloseCircleOutlined } from '@ant-design/icons'
import Thumb from '../Thumb'
import { removeFromCart, incrementFromCart, decrementFromCart } from '../../store/actions/products'
import {
  extractColorFromVariation,
  extractSizeFromVariation,
  getFeaturedImage
} from '../../helpers'

function CartProduct({ product_variation }) {
  const dispatch = useDispatch()

  const classes = ['shelf-item']

  const price = `R$${parseFloat(product_variation.product.price).toFixed(2).replace('.', ',')}`
  const priceSale = `R$${parseFloat(product_variation.price).toFixed(2).replace('.', ',')}`

  return (
    <div className={classes.join(' ')}>
      <CloseCircleOutlined
        onClick={() => dispatch(removeFromCart(product_variation.external_id))}
        className="removeCart"
      />

      <Thumb
        src={getFeaturedImage(product_variation.image)}
        alt={product_variation.product.description}
      />

      <div className="shelf-item__details">
        <Link href={`/produto/${product_variation.father_code}`} passHref>
          <p className="title-cart">{product_variation.product.description}</p>
        </Link>

        <div className="desc">
          <div style={{ display: 'flex' }}>
            {product_variation.size ? <p> {product_variation.size} </p> : null}
            {product_variation.color ? (
              <p style={{ marginLeft: '0.7rem' }}>{product_variation.color} </p>
            ) : null}
          </div>

          <p> Quantidade: {product_variation.quantity} </p>
        </div>
      </div>

      <div className="shelf-item__price">
        {priceSale !== price ? <p>{priceSale}</p> : <p>{price}</p>}
        <div style={{ display: 'flex' }}>
          <button
            className="change-product-button"
            onClick={() => dispatch(decrementFromCart(product_variation.external_id))}
            disabled={product_variation.quantity === 1}
          >
            <MinusOutlined />
          </button>
          <button
            className="change-product-button"
            disabled={product_variation.supply < 1}
            title={
              product_variation.supply < 1
                ? 'Este produto não tem esta quantidade disponível.'
                : null
            }
            onClick={() => dispatch(incrementFromCart(product_variation.external_id))}
          >
            <PlusOutlined />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartProduct
