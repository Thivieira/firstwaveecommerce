export const removeIdDuplicate = (id) => id + String(Math.random());

export function removeFromArray(arr, toRemove) {
  return arr.filter((item) => toRemove.indexOf(item) === -1);
}

//https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
export const stripHtml = (text) => text.replace(/(<([^>]+)>)/gi, "");

export const convert_mercadopago_payment_methods = (payment_method) => {
  switch (payment_method) {
    case "account_money":
      return "Dinheiro na conta do Mercado Pago.";
    case "ticket":
      return "Boleto";
    case "bank_transfer":
      return "PIX ou Transferência bancária";
    case "atm":
      return "Caixa Eletrônico";
    case "credit_card":
      return "Cartão de crédito";
    case "debit_card":
      return "Cartão de débito";
    case "prepaid_card":
      return "Cartão pré-pago";
  }
};

export const convert_mercadopago_status = (status, type = "names") => {
  var string = null;
  switch (status) {
    case "approved":
      // verde
      if (type == "colors") {
        string = "#3FB57A";
      } else {
        string = "Pago";
      }
      break;
    case "pending":
      // amarelo
      if (type == "colors") {
        string = "#E9DC40";
      } else {
        string = "Aguardando";
      }
      break;
    case "authorized":
      // verde
      if (type == "colors") {
        string = "#3FB57A";
      } else {
        string = "Autorizado";
      }
    case "in_process":
      // amarelo
      if (type == "colors") {
        string = "#E9DC40";
      } else {
        string = "Em revisão";
      }
      break;
    case "in_mediation":
      // amarelo
      if (type == "colors") {
        string = "";
      } else {
        string = "Em disputa";
      }
      break;
    case "rejected":
      // vermelho
      // tentar novamente
      if (type == "colors") {
        string = "#ff4d4f";
      } else {
        string = "Rejeitado";
      }
      break;
    case "cancelled":
      // vermelho
      // amarelo
      if (type == "colors") {
        string = "#ff4d4f";
      } else {
        string = "Cancelado";
      }
      break;
    case "refunded":
      // vermelho
      if (type == "colors") {
        string = "#FF66E3";
      } else {
        string = "Estornado";
      }
      break;
    case "charged_back":
      // vermelho
      if (type == "colors") {
        string = "#FF66E3";
      } else {
        string = "Chargeback";
      }
      break;
  }
  return string;
};

export const formatToMoney = (money, currency = true) => {
  if (currency) {
    return Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
    }).format(money);
  } else {
    return Intl.NumberFormat("pt-br", { minimumFractionDigits: 2 }).format(
      money
    );
  }
};

export function defaultBlur() {
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=`;
}

export function extractSizeFromVariation(variation) {}

export function extractColorFromVariation(variation) {}
