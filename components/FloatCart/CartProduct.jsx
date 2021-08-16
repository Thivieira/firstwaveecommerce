import React, { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import Thumb from "../Thumb";
import {
  removeFromCart,
  incrementFromCart,
  decrementFromCart,
} from "../../store/actions/products";
import {
  PlusOutlined,
  MinusOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  extractColorFromVariation,
  extractSizeFromVariation,
  getFeaturedImage,
} from "../../helpers";

function CartProduct({ product_variation }) {
  const dispatch = useDispatch();

  const classes = ["shelf-item"];

  const price = `R$${parseFloat(product_variation.product.price)
    .toFixed(2)
    .replace(".", ",")}`;
  const priceSale = `R$${parseFloat(product_variation.price)
    .toFixed(2)
    .replace(".", ",")}`;

  return (
    <>
      <div className={classes.join(" ")}>
        <CloseCircleOutlined
          onClick={() =>
            dispatch(removeFromCart(product_variation.external_id))
          }
          className="removeCart"
        />

        <Thumb
          src={getFeaturedImage(product_variation.image)}
          alt={product_variation.product.description}
        />

        <div className="shelf-item__details">
          <Link href={`/produto/${product_variation.code}`} passHref>
            <p className="title-cart">
              {product_variation.product.description}
            </p>
          </Link>

          <div className="desc">
            {extractSizeFromVariation(product_variation) ? (
              <p> Tamanho: {extractSizeFromVariation(product_variation)} </p>
            ) : null}
            <p> Cor: {extractColorFromVariation(product_variation)} </p>
            <p> Quantidade: {product_variation.quantity} </p>
          </div>
        </div>

        <div className="shelf-item__price">
          {priceSale !== price ? <p>{priceSale}</p> : <p>{price}</p>}
          <div>
            <button
              className="change-product-button"
              onClick={() =>
                dispatch(decrementFromCart(product_variation.external_id))
              }
              disabled={product_variation.quantity === 1 ? true : false}
            >
              <MinusOutlined />
            </button>
            <button
              className="change-product-button"
              disabled={product_variation.supply < 1 ? true : false}
              title={
                product_variation.supply < 1
                  ? "Este produto não tem esta quantidade disponível."
                  : null
              }
              onClick={() =>
                dispatch(incrementFromCart(product_variation.external_id))
              }
            >
              <PlusOutlined />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartProduct;
