export const removeIdDuplicate = (id) => id + String(Math.random());

//https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
export const stripHtml = (text) => text.replace(/(<([^>]+)>)/gi, "");

export const convert_mercadopago_payment_methods = (payment_method) => {
  switch (payment_method) {
    case "account_money":
      return "Dinheiro na conta do Mercado Pago.";
    case "ticket":
      return "Boleto";
    case "bank_transfer":
      return "Transferência Bancária";
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

export const convert_mercadopago_status = (status) => {
  switch (status) {
    case "approved":
      // verde
      return "Pago";
    case "pending":
      // amarelo
      return "Aguardando pagamento";
    case "authorized":
      // verde
      return "Autorizado";
    case "in_process":
      // amarelo
      return "Pagamento em revisão";
    case "in_mediation":
      // amarelo
      return "Em disputa";
    case "rejected":
      // vermelho
      // tentar novamente
      return "Pagamento rejeitado.";
    case "cancelled":
      // vermelho
      // amarelo
      return "Pagamento cancelado.";
    case "refunded":
      // vermelho
      return "Pagamento estornado.";
    case "charged_back":
      // vermelho
      return "Chargeback";
  }
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
