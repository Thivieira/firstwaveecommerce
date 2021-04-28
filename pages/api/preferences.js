export default function handler(req, res) {
  if (req.method === "POST") {
    // SDK do Mercado Pago
    const mercadopago = require("mercadopago");
    // Adicione as credenciais
    mercadopago.configure({
      access_token: process.env.ACCESS_TOKEN,
    });

    let preference = {
      items: [
        {
          title: req.body.description,
          unit_price: Number(req.body.price),
          quantity: Number(req.body.quantity),
        },
      ],
      back_urls: {
        success: "http://localhost:8080/feedback",
        failure: "http://localhost:8080/feedback",
        pending: "http://localhost:8080/feedback",
      },
      auto_return: "approved",
    };

    mercadopago.preferences
      .create(preference)
      .then(function (response) {
        // Este valor substituirá a string "<%= global.id %>" no seu HTML
        global.id = response.body.id;
        res.status(200).json({ name: "John Doe" });
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).json({ error: "Ocorreu um erro no servidor." });
      });
  }
}
