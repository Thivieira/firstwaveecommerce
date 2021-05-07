import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CartProduct from "./CartProduct";
import {
  getCartTotal,
  getCartState,
  getIsOpen,
} from "../../store/selectors/products";
import Link from "next/link";
import { ReactComponent as Cart } from "../../public/shopping-cart-solid.svg";
import { Badge } from "antd";

import { changeIsOpen } from "../../store/actions/products";
import { CloseSquareOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

function FloatCart() {
  const dispatch = useDispatch();

  const router = useRouter();

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
    router.push("/pagamento");
  };

  const cart = productsCart.map((p) => {
    return <CartProduct product={p} key={p.codigoVariacao} />;
  });

  const classes = ["float-cart"];

  if (!!isOpen) {
    classes.push("float-cart--open");
  }

  return (
    <>
      <div className={classes.join(" ")}>
        {isOpen && (
          <div onClick={closeFloatCart} className="float-cart__close-btn">
            <CloseSquareOutlined className="icon-close-cart" />
          </div>
        )}

        {!isOpen && (
          <span onClick={openFloatCart} className="bag bag--float-cart-closed">
            <Badge
              count={itemQuantity}
              style={{ backgroundColor: "#ffa500", fontWeight: "700" }}
            >
              <Cart height="35" width="35" color="#0080A8" />
            </Badge>
          </span>
        )}

        <div className="float-cart__content">
          <div className="float-cart__header">
            <span className="bag">
              <Badge
                count={itemQuantity}
                style={{ backgroundColor: "#0080A8", fontWeight: "700" }}
              >
                <Cart height="35" width="35" color="rgba(255, 165, 0, 0.6)" />
              </Badge>
            </span>
            <span className="header-title">CARRINHO</span>
          </div>

          <div className="float-cart__shelf-container">
            {cart}

            {productsCart.length === 0 && (
              <p className="shelf-empty">Adicione algum produto no carrinho</p>
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
            {authorized ? (
              <div
                className="buy-btn"
                onClick={authorizedCart}
                style={{ cursor: "pointer" }}
                title="Finalizar"
              >
                <Link href={total !== 0 ? "/pagamento" : ""} className="logado">
                  FINALIZAR
                </Link>
              </div>
            ) : (
              <div
                className="buy-btn"
                onClick={noAuthorized}
                style={{ cursor: "pointer" }}
                title="Finalizar"
              >
                <Link href="/login" className="Nlogado">
                  FINALIZAR
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default FloatCart;
