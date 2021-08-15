import axios from "axios";

const api = axios.create({
  baseURL: "https://api.lifestylefloripa.com.br",
});

export default api;

export const fetcher = (url) => api.get(url).then((res) => res.data);
