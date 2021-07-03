import axios from "axios";

const api = axios.create({
  baseURL: "http://api.lifestylefloripa.com.br",
});

export default api;
