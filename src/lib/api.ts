import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.status} ${response.config.url}`)
    }
    return response
  },
  (error) => {
    const { response } = error

    console.log('API Error:', {
      url: error.config?.url,
      status: response?.status,
      data: response?.data,
    })

    return Promise.reject(error)
  },
)
