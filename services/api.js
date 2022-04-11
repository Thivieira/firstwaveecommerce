import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

if (typeof window !== 'undefined') {
  const token = window.localStorage.getItem('token')

  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token.replace(/['"]+/g, '')}`
  }

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error) return error
      // console.log(error, 'error')
      // console.log(error.response, 'response')
      if (error.response.status === 401) {
        // console.log(window.localStorage);
        window.localStorage.removeItem('token')
      }
      return error
    }
  )
}

export default api

export const fetcher = (url) => api.get(url).then((res) => res)

export const serverFetcher = (url) =>
  axios.get(`${process.env.NEXT_PUBLIC_API_URL}${url}`).then((res) => res.data)
