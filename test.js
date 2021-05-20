const minifyXML = require("minify-xml").minify;
var convert = require("xml-js");
const obj = {
  pedido: {
    loja: "203351750", //id loja
    cliente: {
      nome: "Samuel Rodrigo Aparício",
      cnpj: null,
      cpf: null,
      ie: null,
      rg: "",
      endereco: "Rua dos Girassóis",
      numero: 258,
      complemento: "",
      cidade: "Parnamirim",
      bairro: "Centro",
      cep: "59140-053",
      uf: "RN",
      email: "samuelrodrigoaparicio@me.com",
      celular: null,
      fone: null,
    },
    pagamento: {
      categoria: "Vendas",
    },
    itens: [
      {
        item: {
          codigo: "5629870562",
          descricao: "CAMISETA TEST",
          qtde: "1",
          vlr_unit: "80",
        },
      },
    ],
    parcelas: [
      // {
      //   parcela: {
      //     idLancamento: "6588650860",
      //     valor: "151.20",
      //     dataVencimento: "2019-09-25 00:00:00",
      //     obs: "",
      //     destino: "1",
      //     formaPagamento: {
      //       id: "772684",
      //       descricao: "Cartão de Débito",
      //       codigoFiscal: "4",
      //     },
      //   },
      // },
    ],
  },
};
var json = JSON.stringify(obj);
var options = { compact: true, ignoreComment: true, spaces: 4 };
var result = minifyXML(convert.json2xml(json, options));
console.log(result);
