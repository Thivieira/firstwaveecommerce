import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Status from "../../components/Status";
import { Button } from "antd";
import { clearCart } from "../../store/actions/products";
import { getCartState } from "../../store/selectors/products";
import { getAccount, getAddress } from "../../store/selectors/user";
import { useDispatch, useSelector } from "react-redux";
import blingStoreOrder from "../../services/blingStoreOrder";

export default function index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector(getCartState);
  const user = useSelector(getAccount);
  const address = useSelector(getAddress);
  const [shouldClearCart, setShouldClearCart] = useState(false);

  useEffect(async () => {
    if (shouldClearCart) {
      dispatch(clearCart());
    }
  }, [shouldClearCart]);

  useEffect(async () => {
    const query = router.query;
    const orderResult = await axios.post("/api/order", {
      cart,
      user: { ...user, ...address },
    });
  }, []);

  const renderStatus = () => {
    switch (router.query.slug) {
      case "sucesso":
        setShouldClearCart(true);
        return (
          <Status
            status="success"
            title="Sua compra foi efetuada com sucesso!"
            subTitle={`Pedido #${router.query.payment_id} enviado, confira seu email para acompanhar a entrega.`}
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={() => {
                  router.push("/");
                }}
              >
                Ver mais produtos
              </Button>,
              <Button
                key="buy"
                onClick={() => {
                  router.push("/dashboard");
                }}
              >
                Conferir pedido
              </Button>,
            ]}
          />
        );
      case "processando":
        setShouldClearCart(true);
        return (
          <Status
            title="Successfully Purchased Cloud Server ECS!"
            extra={[
              <Button type="primary" key="console">
                Go Console
              </Button>,
            ]}
          />
        );
      case "erro":
        return (
          <Status
            status="error"
            title="Aconteceu um erro com o seu pedido."
            extra={[
              <Button
                key="buy"
                type="primary"
                onClick={() => {
                  router.push("/pagamento");
                }}
              >
                Tentar novamente
              </Button>,
              <Button
                key="console"
                onClick={() => {
                  router.push("/");
                }}
              >
                Ver outros produtos
              </Button>,
            ]}
          />
        );
      default:
        return null;
    }
  };

  return <div style={{ height: "58vh" }}>{renderStatus()}</div>;
}
