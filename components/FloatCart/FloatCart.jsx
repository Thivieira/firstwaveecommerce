import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartProduct from "./CartProduct";
import {
  getCartTotal,
  getCartState,
  getIsOpen,
} from "../../store/selectors/products";

import ShoppingCartSolid from '../ShoppingCartSolid';
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

  const cart = useSelector(getCartState);
  const total = useSelector(getCartTotal);

  const [cartStorage, setCartStorage] = useCart("cart");

  const MySwal = withReactContent(Swal);

  const [token] = useToken();

  const itemQuantity = cart
    .map((item) => item.quantity)
    .reduce((item, total) => item + total, 0);

  const openFloatCart = () => dispatch(changeIsOpen(true));

  const closeFloatCart = () => dispatch(changeIsOpen(false));

  useEffect(() => {
    setCartStorage({ cart, total });
  }, [cart, setCartStorage, total]);

  useEffect(() => {
    dispatch(updateCart({ cart: cartStorage.cart, total: cartStorage.total }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const noAuthorized = () => {
    closeFloatCart();
    if (total === 0) {
      MySwal.fire({
        title: <p>Carrinho está vazio!</p>,
        confirmButtonText: "OK",
      });
    } else {
      MySwal.fire({
        title: <p>Faça login ou cadastre-se antes de finalizar no carrinho</p>,
        confirmButtonText: "OK",
      }).then((res) => {
        if (res.isConfirmed) {
          router.push("/login");
        }
      });
    }
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
              <ShoppingCartSolid height="35" width="35" color="#0080A8" />
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
                <ShoppingCartSolid height="35" width="35" color="#ffa500" />
              </Badge>
            </span>
            <span className="header-title">CARRINHO</span>
          </div>

          <div className="float-cart__shelf-container">
            {cart.map((pv) => {
              return (
                <CartProduct product_variation={pv} key={pv.external_id} />
              );
            })}

            {cart.length === 0 && (
              <p className="shelf-empty">Adicione algum produto no carrinho</p>
            )}
          </div>
          <div className="float-cart__footer">
            <div className="sub">TOTAL</div>
            <div className="sub-price">
              <p className="sub-price__val">
                {`R$${total.toFixed(2).replace(".", ",")}`}
              </p>

              {cart.length > 0 && (
                <span className="sub-price__installment">
                  {`6x de R$${(total / 6)
                    .toFixed(2)
                    .replace(
                      ".",
                      ","
                    )} sem juros no cartão ou 12% de desconto no boleto e pix`}
                </span>
              )}
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
