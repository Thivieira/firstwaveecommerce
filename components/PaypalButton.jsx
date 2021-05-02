import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { getCartTotal } from "../store/selectors/products";

function PaypalButton() {
  const paypal = useRef();
  const total = useSelector(getCartTotal);

  useEffect(() => {
    let script = document.getElementById("paypal-sdk");
    if (!script) {
      script = document.createElement("script");
      script.setAttribute("id", "paypal-sdk");
      script.setAttribute("data-page-type", "checkout");
      script.src =
        "https://www.paypal.com/sdk/js?client-id=AVCl6x2qRFhEIRvu6cZ85Wp3XcsU2solpUz4vPrx-vxJs2VbF7R5p2uu-lk68PUjJ9ykDMSfN-wyOGPx&currency=BRL";
      document.getElementsByTagName("head")[0].appendChild(script);
    }

    script.onload = function () {
      window.paypal
        .Buttons({
          createOrder: (data, actions, err) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: "Primeira Onda",
                  amount: {
                    currency_code: "BRL",
                    value: total,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            // console.log(order);
          },
          onError: (err) => {
            console.log(err);
          },
        })
        .render(paypal.current);
    };
  }, []);

  return (
    <div>
      <div ref={paypal}></div>
    </div>
  );
}

export default PaypalButton;
