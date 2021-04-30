import React, { useEffect, useState } from "react";

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

export default function PaymentBtn(props) {
  const [loaded, setLoaded] = useState(false);
  /**
   * Salvar no backend a preferencia da compra (cart), receber a preferencia, atualizar o id da preferencia na lib frontend
   */
  const mpRun = () => {
    console.log(process.env.PUBLIC_KEY);
    // Adicione as credenciais do SDK
    const mp = new MercadoPago(process.env.PUBLIC_KEY, {
      locale: "pt-BR",
    });

    // Inicialize o checkout
    mp.checkout({
      preference: {
        id: "YOUR_PREFERENCE_ID",
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
      mpRun();
    });
  }, []);

  return <div className="cho-container"></div>;
}
