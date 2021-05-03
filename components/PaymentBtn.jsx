import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getCartState } from "../store/selectors/products";
import { getAddress } from "../store/selectors/user";
import { setPreferenceId } from "../store/actions/products";

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

function create_preference(cart, address) {
  let preferenceId;
  axios
    .post("/api/preferences", {
      cart,
      address,
    })
    .then((data) => {
      preferenceId = data.id;
    });
  return preferenceId;
}

export default function PaymentBtn(props) {
  const [loaded, setLoaded] = useState(false);
  const [clicked, setClickState] = useState(false);
  const cart = useSelector(getCartState);
  const address = useSelector(getAddress);
  const dispatch = useDispatch();
  let mp = null;
  let checkout = null;
  // setPreferenceId
  /**
   * Salvar no backend a preferencia da compra (cart), receber a preferencia, atualizar o id da preferencia na lib frontend
   */
  const mpRun = (preferenceId) => {
    // Adicione as credenciais do SDK
    mp = new MercadoPago(process.env.PUBLIC_KEY, {
      locale: "pt-BR",
    });

    // Inicialize o checkout
    checkout = mp.checkout({
      preference: {
        id: preferenceId,
      },
      render: {
        container: ".cho-container", // Indica onde o botão de pagamento será exibido
        label: "Pagar", // Muda o texto do botão de pagamento (opcional)
      },
      theme: {
        elementsColor: "#1890ff",
        headerColor: "#1890ff",
      },
      autoOpen: true,
      init_point: "redirect",
    });

    window.mp = mp;
    window.checkout = checkout;
  };

  useEffect(() => {
    if (clicked) {
      loadMercadoPago(() => {
        setLoaded(true);
        const preferenceId = create_preference(cart, address);
        dispatch(setPreferenceId(preferenceId));
        mpRun(preferenceId);
      });
    }
  }, [clicked]);

  return (
    <div
      className={"pure-material-button-contained  cho-container"}
      onClick={() => {
        loaded ? checkout.open() : setClickState(true);
      }}
    >
      Pagar
      {/* {!clicked ? "Pagar" : null} */}
    </div>
  );
}
