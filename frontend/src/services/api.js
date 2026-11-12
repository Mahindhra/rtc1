import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rtc-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function errorMessage(error) {
  if (error.response?.data?.message || error.response?.data?.error) {
    return error.response.data.message || error.response.data.error
  }
  if (!error.response) {
    const endpoint = api.defaults.baseURL
    return `Passenger Care API is not reachable at ${endpoint}. Start the Spring Boot backend and confirm MySQL credentials and JWT_SECRET are configured.`
  }
  return 'Passenger Care could not complete this request. Please try again.'
}

export default api