import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

export default api

export const fetcher = (url) => api.get(url).then((res) => res)

export const serverFetcher = (url) =>
  axios.get(`${process.env.NEXT_PUBLIC_API_URL}${url}`).then((res) => res.data)
