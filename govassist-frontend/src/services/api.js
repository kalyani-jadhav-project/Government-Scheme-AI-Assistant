import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('govassist_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('govassist_token')
      localStorage.removeItem('govassist_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth ───────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

// ─── User ────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
}

// ─── Schemes ─────────────────────────────────────────────────────
export const schemeAPI = {
  getAllSchemes: () => api.get('/schemes/all'),
  getScheme: (id) => api.get(`/schemes/${id}`),
  generateRecommendations: () => api.post('/schemes/recommend'),
  getRecommendations: () => api.get('/schemes/recommendations'),
}

// ─── AI ──────────────────────────────────────────────────────────
export const aiAPI = {
  chat: (message, schemeContext = '') => api.post('/ai/chat', { message, schemeContext }),
  explainEligibility: (rec) => api.post('/ai/explain', rec),
  getAlternatives: (schemeName, reasons) => api.post('/ai/alternatives', { schemeName, reasons }),
  getGuidance: (schemeName) => api.get(`/ai/guidance/${encodeURIComponent(schemeName)}`),
}

export default api
