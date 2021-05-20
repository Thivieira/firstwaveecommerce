import axios from "axios";
const minifyXML = require("minify-xml").minify;
var convert = require("xml-js");

export default async function blingStoreOrder(cart, userObj) {
  const items = cart.map((product) => {
    return {
      item: {
        codigo: product.codigoVariacao,
        descricao: product.descricao,
        qtde: product.quantity,
        vlr_unit: parseFloat(product.preco),
      },
    };
  });
  const obj = {
    pedido: {
      loja: process.env.BLING_LOJA, //id loja
      cliente: {
        nome: userObj.name,
        cpf: userObj.cpf,
        endereco: userObj.street,
        numero: userObj.number,
        complemento: userObj.complement,
        cidade: userObj.city,
        bairro: userObj.neighborhood,
        cep: userObj.zipcode,
        uf: userObj.state,
        email: userObj.email,
        celular: userObj.phone,
      },
      pagamento: {
        categoria: "Vendas",
      },
      itens: items,
    },
  };
  var json = JSON.stringify(obj);
  var options = { compact: true, ignoreComment: true, spaces: 4 };
  const xml = minifyXML(convert.json2xml(json, options));
  try {
    const { data } = await axios.post(
      `https://bling.com.br/Api/v2/pedido/json/?apikey=${process.env.BLING_API_KEY}&xml=${xml}`
    );
    if (data.retorno) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    if (e) {
      return false;
    }
  }
}
