import React, { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import Thumb from "../Thumb";
import {
  removeFromCart,
  incrementFromCart,
  decrementFromCart,
} from "../../store/actions/products";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

function CartProduct({ product }) {
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleMouseOver = () => setIsMouseOver(true);

  const handleMouseOut = () => setIsMouseOver(false);

  const dispatch = useDispatch();

  const classes = ["shelf-item"];

  if (!!isMouseOver) {
    classes.push("shelf-item--mouseover");
  }

  return (
    <>
      <div className={classes.join(" ")}>
        <div
          className="shelf-item__del"
          onMouseOver={() => handleMouseOver()}
          onMouseOut={() => handleMouseOut()}
          onClick={() => dispatch(removeFromCart(product.codigoVariacao))}
        />

        <Thumb src={product.imagemVariacao} alt={product.descricao} />

        <div className="shelf-item__details">
          <Link href={`/produto/${product.codigo}`}>
            <p className="title-cart">{product.descricao}</p>
          </Link>

          <div className="desc">
            {product.size ? <p> Tamanho: {product.size} </p> : null}
            <p> Cor: {product.color} </p>
            <p> Quantidade: {product.quantity} </p>
          </div>
        </div>

        <div className="shelf-item__price">
          <p>{parseFloat(product.price).toFixed(2).replace(".", ",")}</p>
          <div>
            <button
              className="change-product-button"
              onClick={() =>
                dispatch(decrementFromCart(product.codigoVariacao))
              }
              disabled={product.quantity === 1 ? true : false}
            >
              <MinusOutlined />
            </button>
            <button
              className="change-product-button"
              disabled={product.estoqueAtual < 1 ? true : false}
              title={
                product.estoqueAtual < 1
                  ? "Este produto não tem esta quantidade disponível."
                  : null
              }
              onClick={() =>
                dispatch(incrementFromCart(product.codigoVariacao))
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
