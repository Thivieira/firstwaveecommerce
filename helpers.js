export const removeIdDuplicate = (id) => id + String(Math.random());

//https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
export const stripHtml = (text) => text.replace(/(<([^>]+)>)/gi, "");

export const convert_mercadopago_payment_methods = (payment_method) => {
  switch (payment_method) {
    case "":
      return "";
    case "":
      return "";
    case "":
      return "";
    case "":
      return "";
  }
};

export const convert_mercadopago_status = (status) => {
  switch (status) {
    case "approved":
      return "";
    case "":
      return "";
    case "":
      return "";
    case "":
      return "";
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
