import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 for non-AI routes
    if (
      error.response?.status === 401 &&
      !error.config.url.includes('/ai/')
    ) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api