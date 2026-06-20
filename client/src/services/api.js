import axios from 'axios'
import { emitServerStatus } from '../utils/serverStatusEmitter'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000, // 15 sec se zyada response na aaye toh timeout maan lo
})

// Har request ke saath token automatically attach ho jayega
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    // Koi bhi successful response aaya matlab server up hai
    emitServerStatus(false)
    return response
  },
  (error) => {
    // error.response na ho matlab request server tak pahuchi hi nahi (network error / server down / timeout)
    if (!error.response) {
      emitServerStatus(true)
    } else if (error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api