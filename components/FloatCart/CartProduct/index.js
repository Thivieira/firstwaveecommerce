import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import Thumb from "../../Thumb";
// import {
//     removeFromCart,
//     incrementFromCart,
//     decrementFromCart,
// } from "../../../actions/products";

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
        <Fragment>
            <div className={classes.join(" ")}>
                <div
                    className="shelf-item__del"
                    onMouseOver={() => handleMouseOver()}
                    onMouseOut={() => handleMouseOut()}
                    onClick={() =>
                        dispatch(removeFromCart(product.codigoVariacao))
                    }
                />

                <Thumb src='/image1.jpg' alt={product.descricao} />

                <div className="shelf-item__details">
                    <p className="title-cart">{product.descricao}</p>

                    <div className="desc">
                        {product.size ? <p> Tamanho: {product.size} </p> : null}
                        <p> Cor: {product.color} </p>
                        <p> Quantidade: {product.quantity} </p>
                    </div>
                </div>

                <div className="shelf-item__price">
                    <p>
                        {parseFloat(product.preco).toFixed(2).replace(".", ",")}
                    </p>
                    <div>
                        <button
                            className="change-product-button"
                            onClick={() =>
                                dispatch(
                                    decrementFromCart(product.codigoVariacao)
                                )
                            }
                            disabled={product.quantity === 1 ? true : false}
                        >
                            -
                        </button>

                        <button
                            className="change-product-button"
                            disabled={product.estoqueAtual <= 1 ? true : false}
                            title={
                                product.estoqueAtual <= 1
                                    ? "Este produto não tem esta quantidade disponível."
                                    : null
                            }
                            onClick={() =>
                                dispatch(
                                    incrementFromCart(product.codigoVariacao)
                                )
                            }
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default CartProduct;
