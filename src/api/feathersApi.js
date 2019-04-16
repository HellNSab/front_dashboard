import axios from 'axios'

const feathersApi = axios.create({
  baseURL: 'http://localhost:3030/'
})

feathersApi.interceptors.response.use(response => response.data)

export default feathersApi
