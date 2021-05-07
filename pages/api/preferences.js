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
        res.status(200).json({
          preferenceId: response.body.id,
          init_point: response.body.init_point,
        });
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
    const account = req.body.account;

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

    console.log("ITEMS", items);

    let firstName = account.name.split(" ").slice(0, -1).join(" ");
    let lastName = account.name.split(" ").slice(-1).join(" ");
    let stripedPhone = account.phone.replace(/\D/g, "");
    let area_code = stripedPhone.substring(0, 2);
    let number = stripedPhone.substring(2);
    let preference = {
      items,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/status/sucesso`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/status/erro`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/status/processando`,
      },
      payer: {
        name: firstName,
        surname: lastName,
        email: account.email,
        date_created: new Date().toISOString(),
        phone: {
          area_code: area_code,
          number: Number(number),
        },

        identification: {
          type: "CPF",
          number: account.cpf,
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
        res.status(200).json({
          preferenceId: response.body.id,
          init_point: response.body.init_point,
        });
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).json({ error: "Ocorreu um erro no servidor." });
      });
  }
}
