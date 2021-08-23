import axios from "axios";
import fetch from "node-fetch";

const api = axios.create({
  baseURL: "https://api.lifestylefloripa.com.br",
});

export default api;

export const fetcher = (url) => api.get(url).then((res) => res);

export const serverFetcher = (url) =>
  fetch(`https://api.lifestylefloripa.com.br${url}`)
    .then((res) => res.json())
    .then((res) => res);
