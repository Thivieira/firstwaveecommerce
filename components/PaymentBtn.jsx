import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getCartState } from "../store/selectors/products";
import { getAccount, getAddress } from "../store/selectors/user";
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

async function create_preference(cart, address, account) {
  const { data } = await axios.post("/api/preferences", {
    cart,
    address,
    account,
  });

  return {
    preferenceId: data.preferenceId,
    init_point: data.init_point,
  };
}

export default function PaymentBtn(props) {
  const [loaded, setLoaded] = useState(false);
  const [clicked, setClickState] = useState(false);
  const cart = useSelector(getCartState);
  const address = useSelector(getAddress);
  const account = useSelector(getAccount);
  const dispatch = useDispatch();
  let mp = null;
  let checkout = null;
  let init_point_link;
  // setPreferenceId
  /**
   * Salvar no backend a preferencia da compra (cart), receber a preferencia, atualizar o id da preferencia na lib frontend
   */
  const mpRun = (preferenceId, init_point_arg) => {
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
    window.location = `${init_point_arg}`;
  };

  useEffect(() => {
    if (clicked) {
      loadMercadoPago(async () => {
        setLoaded(true);
        const preferenceObj = await create_preference(cart, address, account);
        init_point_link = preferenceObj.init_point;
        dispatch(setPreferenceId(preferenceObj.preferenceId));
        console.log("preferenceObj", preferenceObj);
        mpRun(preferenceObj.preferenceId, init_point_link);
      });
    }
  }, [clicked]);

  return (
    <div
      className={"pure-material-button-contained  cho-container"}
      onClick={() => {
        loaded ? (window.location = `${init_point_link}`) : setClickState(true);
      }}
    >
      Pagar
      {/* {!clicked ? "Pagar" : null} */}
    </div>
  );
}
