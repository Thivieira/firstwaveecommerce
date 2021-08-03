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
import { NextSeo } from "next-seo";
// This gets called on every request
export async function getServerSideProps(ctx) {
  return { props: { slug: ctx.params.slug } };
}

export default function index(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector(getCartState);
  const user = useSelector(getAccount);
  const address = useSelector(getAddress);

  useEffect(async () => {
    // const orderResult = await axios.post("/api/order", {
    //   cart,
    //   user: { ...user, ...address },
    // });

    switch (props.slug) {
      case "sucesso":
        dispatch(clearCart());
        break;
      case "processando":
        dispatch(clearCart());
        break;
    }
  }, []);

  const renderStatus = () => {
    switch (props.slug) {
      case "sucesso":
        return (
          <>
            <NextSeo
              title="Sua compra foi efetuada com sucesso! - Lifestyle Floripa by Billabong"
              description="Status do pedido de compra - Sua surf shop na Praia Mole."
            />
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
          </>
        );
      case "processando":
        return (
          <>
            <NextSeo
              title="Sua compra foi efetuada com sucesso! - Lifestyle Floripa by Billabong"
              description="Status do pedido de compra - Sua surf shop na Praia Mole."
            />
            <Status
              title="Sua compra foi efetuada com sucesso!"
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
          </>
        );
      case "erro":
        return (
          <>
            <NextSeo
              title="Aconteceu um erro com o seu pedido - Lifestyle Floripa by Billabong"
              description="Status do pedido de compra - Sua surf shop na Praia Mole."
            />
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
          </>
        );
      default:
        return null;
    }
  };

  return <div style={{ height: "58vh" }}>{renderStatus()}</div>;
}
