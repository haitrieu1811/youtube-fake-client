import axios, { AxiosInstance } from 'axios'

class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
      timeout: 10000
    })
  }
}

const http = new Http()
export default http
