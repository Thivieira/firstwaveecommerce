import React, { useState, Fragment } from "react";
import Link from "next/link";
import CartProduct from "./CartProduct";

import { useDispatch, useSelector } from "react-redux";
// import { getCartTotal, getCartState, getIsOpen, } from "../../selectors/products";
// import { changeIsOpen } from "../../actions/products";

// import { ReactComponent as Cart } from "../../assets/shopping-cart-solid.svg";
import { Badge } from 'antd'
import { CloseSquareOutlined } from "@ant-design/icons";

// import "./style.css";

function FloatCart() {
    const dispatch = useDispatch();

    const isOpen = useSelector(getIsOpen);

    const productsCart = useSelector(getCartState);

    const total = useSelector(getCartTotal);

    const authorized = sessionStorage.getItem("authorized");

    const itemQuantity = productsCart
        .map((item) => item.quantity)
        .reduce((item, total) => item + total, 0);

    const openFloatCart = () => dispatch(changeIsOpen(true));

    const closeFloatCart = () => dispatch(changeIsOpen(false));

    const noAuthorized = () => {
        closeFloatCart();
        alert("Faça login ou cadastre-se antes de finalizar no carrinho");
    };

    const authorizedCart = () => {
        closeFloatCart();
        total === 0 ? alert("Carrinho está vazio!") : closeFloatCart();
    };

    const cart = productsCart.map((p) => {
        return <CartProduct product={p} key={p.codigoVariacao} />;
    });

    const classes = ["float-cart"];

    if (!!isOpen) {
        classes.push("float-cart--open");
    }

    return (
        <Fragment>
            <div className={classes.join(" ")}>
                {isOpen && (
                    <div
                        onClick={closeFloatCart}
                        className="float-cart__close-btn"
                    >
                        <CloseSquareOutlined className='icon-close-cart'/>
                    </div>
                )}

                {!isOpen && (
                    <span onClick={openFloatCart} className="bag bag--float-cart-closed" >
                        
                        <Badge count={itemQuantity} style={{backgroundColor: '#ffa500', fontWeight: '700'}}>
                            <Cart height="35" width="35" color="#0080A8" />
                        </Badge>
                    </span>
                )}

                <div className="float-cart__content">
                    <div className="float-cart__header">
                        <span className="bag">
                            <Badge count={itemQuantity} style={{backgroundColor: '#0080A8', fontWeight: '700'}}>
                                <Cart height="35" width="35" color="rgba(255, 165, 0, 0.6)" />
                            </Badge>
                        </span>
                        <span className="header-title">CARRINHO</span>
                    </div>

                    <div className="float-cart__shelf-container">
                        {cart}

                        {productsCart.length === 0 && (
                            <p className="shelf-empty">
                                Adicione algum produto no carrinho
                            </p>
                        )}
                    </div>

                    <div className="float-cart__footer">
                        <div className="sub">TOTAL</div>
                        <div className="sub-price">
                            <p className="sub-price__val">
                                {`R$ ${total.toFixed(2).replace(".", ",")}`}
                            </p>

                            <small className="sub-price__installment">
                                {!productsCart.installments && (
                                    <span>
                                        {`OU EM 10 x R$ ${(total / 10)
                                            .toFixed(2)
                                            .replace(".", ",")}`}
                                    </span>
                                )}
                            </small>
                        </div>
                        <div className="buy-btn">
                            {
                                authorized ? 
                                (
                                    <Link
                                        href={total !== 0 ? "/payment" : ""}
                                        className="logado"
                                        onClick={authorizedCart}
                                    >
                                        FINALIZAR
                                    </Link>
                                ) : 
                                (
                                    <Link
                                        href="/login"
                                        className="Nlogado"
                                        onClick={noAuthorized}
                                    >
                                        FINALIZAR
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default FloatCart;
