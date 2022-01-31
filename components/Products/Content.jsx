import { useState, useEffect, useCallback, useContext } from 'react'
import ShoppingCartSolid from '../ShoppingCartSolid'
import FavoriteBtn from '../FavoriteBtn'
import noImage from '../../public/noimage.png'
import { upFirst } from '../../helpers'
import { useDispatch } from 'react-redux'
import Router from 'next/router'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { addToCart, changeIsOpen } from '../../store/actions/products'
import { ProductContext } from '../../contexts/ProductContextProvider'

export default function Content() {
  const dispatch = useDispatch()
  const MySwal = withReactContent(Swal)
  const {
    product,
    setImages,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    availableColorVariations,
    setAvailableColorVariations,
    triggerColor,
    setColorTrigger,
    activeVariation,
    setActiveVariation,
    hasSizeVariation,
    setHasSizeVariation
  } = useContext(ProductContext)

  const onSelectedSizeChange = useCallback(
    (value) => {
      setSelectedSize(value)

      const availableSizeVariations = product.variations.filter((el) => el.size == value) //&& el.supply > 0

      setAvailableColorVariations(availableSizeVariations)

      if (availableSizeVariations.length == 0) {
        return false
      }

      setSelectedColor(availableSizeVariations.filter((el) => el.supply > 0)[0].color)
      setColorTrigger(true)
    },
    [product.variations]
  )

  const onSelectedColorChange = useCallback(
    (value) => {
      const product_variations = availableColorVariations.filter((el) => el.color == value) //&& el.supply > 0

      if (product_variations.length == 0) {
        return false
      }

      const product_variation = product_variations[0]

      setImages(product_variation.image)

      setActiveVariation(product_variation)

      setColorTrigger(false)
    },
    [availableColorVariations, selectedColor]
  )

  useEffect(() => {
    if (triggerColor) {
      onSelectedColorChange(selectedColor)
    }
  }, [onSelectedColorChange, selectedColor, triggerColor])

  useEffect(() => {
    /**
     *  INIT PRODUCT
     */
    const product_variations = product.variations

    const productHasSizeVariations =
      product_variations.filter((el) => (el.size ? true : false)).length > 0 ? true : false

    setHasSizeVariation(productHasSizeVariations)

    const supplys = product_variations.map((el) => el.supply)

    const sizes = product_variations.map((el) => el.size)

    var supplyAndSize = {}
    for (var i = 0; i < sizes.length; i++) {
      supplyAndSize[sizes[i]] = supplys[i]
    }

    const firstSizeWithSupply = Object.keys(supplyAndSize)
      .map((size) => supplyAndSize[size] > 0 && size)
      .filter((el) => el != false)[0]

    setImages(product_variations[0].image)

    if (product_variations.length == 0) {
      Router.push('/produtos')
      return false
    }

    if (firstSizeWithSupply != 'null') {
      setSelectedSize(firstSizeWithSupply)

      const availableSizeVariations = product.variations.filter(
        (el) => el.size == firstSizeWithSupply
      )

      setAvailableColorVariations(availableSizeVariations)

      if (availableSizeVariations.length == 0) {
        return false
      }

      setSelectedColor(availableSizeVariations.filter((el) => el.supply > 0)[0].color)
      setColorTrigger(true)
      return true
    }

    setAvailableColorVariations(product_variations)
    setSelectedColor(product_variations[0].color)
    setColorTrigger(true)
    onSelectedColorChange(product_variations[0].color)
  }, [onSelectedSizeChange, product])

  const addToCartFn = () => {
    console.log({ ...activeVariation, product })
    dispatch(addToCart({ ...activeVariation, product }))
    dispatch(changeIsOpen(true))
  }

  const price = `R$${parseFloat(product.price).toFixed(2).replace('.', ',')}`
  const priceSale = `R$${parseFloat(product.variations[0].price).toFixed(2).replace('.', ',')}`

  const installmentPrice = (price) =>
    `R$${parseFloat(price / 6.0)
      .toFixed(2)
      .replace('.', ',')}`

  return (
    <div className="details-content">
      <div className="title-and-heart">
        <h1 className="title-product">
          {product.description} <FavoriteBtn product={product}></FavoriteBtn>
        </h1>
      </div>

      <h5>{product.code}</h5>

      <span className="price-product">
        {priceSale !== price ? (
          <>
            <div className="priceSaleProduct">
              <span>
                De: <p>{price}</p>
              </span>
              <p>
                <span>Por:</span>
                {priceSale}
              </p>
            </div>
          </>
        ) : (
          price
        )}
      </span>

      <p className="installment">
        {priceSale !== price ? (
          <>
            <strong>6x</strong> de <strong>{installmentPrice(product.variations[0].price)}</strong>{' '}
            sem juros no cartão ou <strong>12%</strong> de desconto no boleto ou pix.
          </>
        ) : (
          <>
            <strong>6x</strong> de <strong>{installmentPrice(product.price)}</strong> sem juros no
            cartão ou <strong>12%</strong> de desconto no boleto ou pix.
          </>
        )}
      </p>

      <div className="btn-buy">
        <button
          onClick={() => addToCartFn()}
          disabled={activeVariation.supply <= 0 ? true : false}
          title={
            activeVariation.supply <= 0
              ? 'Este produto não tem esta quantidade disponível.'
              : 'Adicionar ao carrinho.'
          }
        >
          ADICIONAR AO {<ShoppingCartSolid height="20" width="20" color="#fff" />}
        </button>
      </div>

      {hasSizeVariation ? (
        <div className="sizes-btn">
          <strong>Tamanhos:</strong>
          <ul>
            {product.variations
              .filter((variation) => selectedColor === variation.color)
              .map((el) => {
                return el.supply > 0 ? (
                  <li
                    onClick={() => onSelectedSizeChange(el.size)}
                    key={el.external_id}
                    title={`Tamanho ${el.size === 'null' ? 'único' : el.size}`}
                    className={el.size == selectedSize ? 'active' : null}
                  >
                    {el.size === 'null' ? 'único' : el.size}
                  </li>
                ) : (
                  <li key={el.external_id} title="Tamanho não disponível." className="disabled">
                    {el.size === 'null' ? 'único' : el.size}
                  </li>
                )
              })}
          </ul>
        </div>
      ) : null}
      {availableColorVariations.length > 0 ? (
        <div className="colors-product">
          <span>
            <b>Cor:</b>
            <div className="color-text-selected">{upFirst(selectedColor)}</div>
          </span>
          <div className="colors-thumb">
            {availableColorVariations.map((variation) => {
              const color = variation.color
              let image = JSON.parse(variation.image)
              image = image.length > 0 ? image[0].link : noImage.src

              return variation.supply > 0 ? (
                <img
                  onClick={() => {
                    setSelectedColor(color)
                    onSelectedColorChange(color)
                    setImages(variation.image)
                  }}
                  className={color === selectedColor ? 'active' : ''}
                  key={variation.external_id}
                  src={image}
                  width={48}
                  height={48}
                  alt="Cor da imagem do produto."
                  title={`Cor ${color.toLowerCase()}.`}
                  style={{ height: '3rem' }}
                />
              ) : (
                <img
                  className={'disabled'}
                  key={variation.external_id}
                  src={image}
                  width={48}
                  height={48}
                  alt="Cor da imagem do produto."
                  title="Cor não disponível."
                  style={{ height: '3rem' }}
                />
              )
            })}
          </div>
        </div>
      ) : null}

      <div className="info-product">
        <h3>DESCRIÇÃO</h3>
        <p>Marca: {product.brand}</p>
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: product.short_description }}
        ></div>
      </div>
    </div>
  )
}
