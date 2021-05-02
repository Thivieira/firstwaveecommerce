export default function handler(req, res) {
  if (req.method === "POST") {
    // SDK do Mercado Pago
    const mercadopago = require("mercadopago");
    // Adicione as credenciais
    mercadopago.configure({
      access_token: process.env.ACCESS_TOKEN,
    });
    //cart array
    const cart = req.body.cart;

    const items = cart.map((item) => {
      return {
        id: item.codigoVariacao,
        title: item.descricao,
        description: `${item.descricao} - ${item.marca}`,
        picture_url: item.imagemVariacao,
        quantity: parseInt(item.estoqueAtual),
        unit_price: parseFloat(item.preco).toFixed(2),
        currency_id: "BRL",
      };
    });

    let preference = {
      items,
      back_urls: {
        success: "http://localhost:8080/feedback",
        failure: "http://localhost:8080/feedback",
        pending: "http://localhost:8080/feedback",
      },
      auto_return: "approved",
      shipments: {
        receiver_address: {
          zip_code: "",
          street_name: "",
          city_name: "",
          street_name: "",
          city_name: "",
          state_name: "",
          street_number: "",
          floor: "",
          apartment: "",
        },
      },
      statement_descriptor: "",
    };

    mercadopago.preferences
      .create(preference)
      .then(function (response) {
        res.status(200).json({ preferenceId: response.body.id });
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).json({ error: "Ocorreu um erro no servidor." });
      });
  }
}
