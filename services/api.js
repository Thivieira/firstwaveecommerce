import axios from 'axios'

const api = axios.create({
    baseURL: 'https://surfoutlet.herokuapp.com'
})

export default api