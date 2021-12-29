import fetch from "node-fetch";

export const getProduct = (code) =>
  fetch(
    `https://bling.com.br/Api/v2/produto/${code}/json/&apikey=${process.env.NEXT_PUBLIC_BLING_TOKEN}?imagem=S`
  )
    .then((res) => res.json())
    .then((res) => res);
