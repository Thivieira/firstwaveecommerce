import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartProduct from "./CartProduct";
import {
  getCartTotal,
  getCartState,
  getIsOpen,
  getTotalState,
} from "../../store/selectors/products";

import { ReactComponent as Cart } from "../../public/shopping-cart-solid.svg";
import { Badge } from "antd";

import { changeIsOpen, updateCart } from "../../store/actions/products";
import { CloseSquareOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import useCart from "../../contexts/CartStorage";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useToken from "../../contexts/TokenStorage";

function FloatCart() {
  const dispatch = useDispatch();

  const router = useRouter();

  const isOpen = useSelector(getIsOpen);

  const productsCart = useSelector(getCartState);
  const totalCart = useSelector(getTotalState);

  const total = useSelector(getCartTotal);

  const MySwal = withReactContent(Swal);

  const [token] = useToken();

  const itemQuantity = productsCart
    .map((item) => item.quantity)
    .reduce((item, total) => item + total, 0);

  const openFloatCart = () => dispatch(changeIsOpen(true));

  const closeFloatCart = () => dispatch(changeIsOpen(false));

  const [cartStorage, setCartStorage] = useCart("cart");

  // useEffect(() => {
  //   // dispatch(updateCart(cartStorage));
  //   setCartStorage({ cart: productsCart, total: totalCart });
  // }, [cartStorage, dispatch, productsCart, setCartStorage, totalCart]);

  useEffect(() => {
    setCartStorage({ cart: productsCart, total: totalCart });
    dispatch(updateCart({ cart: productsCart, total: totalCart }));
  }, [dispatch, productsCart, setCartStorage, totalCart]);

  const noAuthorized = () => {
    closeFloatCart();
    MySwal.fire({
      title: <p>Faça login ou cadastre-se antes de finalizar no carrinho</p>,
      confirmButtonText: "OK",
    }).then((res) => {
      if (res.isConfirmed) {
        router.push("/login");
      }
    });
  };

  const authorizedCart = () => {
    closeFloatCart();
    if (total === 0) {
      MySwal.fire({
        title: <p>Carrinho está vazio!</p>,
        confirmButtonText: "OK",
      });
    } else {
      router.push("/pagamento");
    }
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
                <Cart height="35" width="35" color="#ffa500" />
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
                    {`EM ATÉ 6 x R$ ${(total / 6)
                      .toFixed(2)
                      .replace(".", ",")}`}
                  </span>
                )}
              </small>
            </div>
            <div
              className="buy-btn"
              onClick={token ? authorizedCart : noAuthorized}
              style={{ cursor: "pointer" }}
              title="Finalizar"
            >
              <span className="logado">FINALIZAR</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FloatCart;
