import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

console.log('API utilisée :', API_URL)

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// ============================================
// IDENTIFIANT VISITEUR
// ============================================
instance.interceptors.request.use(
  (config) => {
    let visitorId = localStorage.getItem('visitorId')

    if (!visitorId) {
      visitorId = crypto.randomUUID()
      localStorage.setItem('visitorId', visitorId)

      console.log('🆕 Nouveau visitorId créé :', visitorId)
    }

    config.headers['X-Visitor-Id'] = visitorId

    console.log('📊 VisitorId envoyé :', visitorId)

    return config
  },
  (error) => Promise.reject(error),
)

// ============================================
// GESTION DES ERREURS
// ============================================
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url

    if (status === 401 && !url?.includes('/auth/login')) {
      window.location.href = '/session-expiree'
    }

    return Promise.reject(error)
  },
)

export default instance
