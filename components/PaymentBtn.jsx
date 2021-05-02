import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { getCartState } from "../store/selectors/products";

const loadMercadoPago = (callback) => {
  const existingScript = document.getElementById("mercadoPagoSdkScript");
  if (!existingScript) {
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.id = "mercadoPagoSdkScript";
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };
  }
  if (existingScript && callback) callback();
};

function create_preference(cart) {
  let preferenceId;
  axios
    .post("/api/preferences", {
      cart,
    })
    .then((data) => {
      preferenceId = data.id;
    });
  return preferenceId;
}

export default function PaymentBtn(props) {
  const [loaded, setLoaded] = useState(false);
  const cart = useSelector(getCartState());
  /**
   * Salvar no backend a preferencia da compra (cart), receber a preferencia, atualizar o id da preferencia na lib frontend
   */
  const mpRun = (preferenceId) => {
    // Adicione as credenciais do SDK
    const mp = new MercadoPago(process.env.PUBLIC_KEY, {
      locale: "pt-BR",
    });

    // Inicialize o checkout
    mp.checkout({
      preference: {
        id: preferenceId,
      },
      render: {
        container: ".cho-container", // Indica onde o botão de pagamento será exibido
        label: "Pagar", // Muda o texto do botão de pagamento (opcional)
      },
    });
  };

  useEffect(() => {
    loadMercadoPago(() => {
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    const preferenceId = create_preference(cart);
    mpRun(preferenceId);
  }, [loaded]);

  return (
    <div
      className="cho-container"
      onClick={alert("not ready, future preference api")}
    ></div>
  );
}
