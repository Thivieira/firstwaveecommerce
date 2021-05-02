export default function handler(req, res) {
  if (req.method === "GET") {
    const mercadopago = require("mercadopago");
    // Adicione as credenciais
    mercadopago.configure({
      access_token: process.env.ACCESS_TOKEN,
    });
    const preferenceId = req.body;

    mercadopago.preferences
      .get(preferenceId)
      .then(function (response) {
        res.status(200).json({ preferenceId: response.body.id });
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).json({ error: "Ocorreu um erro no servidor." });
      });
  }
  if (req.method === "POST") {
    // SDK do Mercado Pago
    const mercadopago = require("mercadopago");
    // Adicione as credenciais
    mercadopago.configure({
      access_token: process.env.ACCESS_TOKEN,
    });
    //cart array
    const cart = req.body.cart;
    const address = req.body.address;
    const address = req.body.account;

    const items = cart.map((item) => {
      return {
        id: item.codigoVariacao,
        title: item.descricao,
        description: `${item.descricao} - ${item.marca}`,
        picture_url: item.imagemVariacao,
        quantity: parseInt(item.estoqueAtual),
        unit_price: parseInt(item.preco),
        currency_id: "BRL",
      };
    });

    let firstName = account.name;
    let lastName = account.name;
    let area_code = account.phone;
    let number = account.phone;
    let preference = {
      items,
      back_urls: {
        success: "http://localhost:8080/feedback",
        failure: "http://localhost:8080/feedback",
        pending: "http://localhost:8080/feedback",
      },
      payer: {
        name: firstName,
        surname: lastName,
        email: account.email,
        phone: {
          area_code: area_code,
          number: number,
        },
        address: {
          zip_code: address.zipcode,
          street_name: address.street,
          city_name: address.city,
          state_name: address.state,
          street_number: address.number,
          apartment: address.complement,
        },
      },
      auto_return: "approved",
      shipments: {
        receiver_address: {
          zip_code: address.zipcode,
          street_name: address.street,
          city_name: address.city,
          state_name: address.state,
          street_number: address.number,
          apartment: address.complement,
        },
      },
      statement_descriptor: "PRIMEIRAONDASTORE",
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
