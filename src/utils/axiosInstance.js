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

/**
 * Un cookie expiré est supprimé par le navigateur en silence. Aucun événement ne prévient votre React que la session est morte.
 * Conséquence : Votre store Redux / état « connecté » continue d'afficher l'utilisateur connecté ;
 * Rien ne se passe… jusqu'à la prochaine requête API protégée, qui part sans cookie → 401 → votre interceptor redirige.
 * Donc la session expire bien à 5 minutes, mais l'expiration n'est visible qu'au premier appel API qui suit.
 * Si votre page ne fait pas de requête protégée, l'utilisateur peut rester « connecté » visuellement pendant des heures.
 * L'expiration de cookie est passive ; il n'existe pas de « timer » de déconnexion automatique tant que vous n'en codez pas un.
 * 
 * Version abonnement:
 * // Frontend : tenter le refresh AVANT d'expulser
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const url = error.config?.url

    if (status === 401 && !url?.includes('/api/v1/auth/refresh') && !isGuestPath(url)) {
      try {
        // 1. Tentative de renouvellement silencieux
        await instance.post('/api/v1/auth/refresh')
        // 2. Ça a marché → on rejoue la requête initiale
        return instance(error.config)
      } catch {
        // 3. Refresh refusé aussi → LÀ on expulse
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)
 */
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url

    const guestPaths = ['/api/v1/freemium', '/api/v1/auth/login']

    // La méthode some() parcourt le tableau et retourne : true dès qu'un élément satisfait la condition
    // false si aucun élément ne satisfait la condition
    // Pour chaque élément p du tableau guestPaths, vérifie si l'URL contient ce chemin.
    // Le ?. (optional chaining) évite une erreur si url vaut null ou undefined.
    const isGuestPath = guestPaths.some((p) => url?.includes(p))

    console.log({
      status,
      url,
      isGuestPath,
      currentPage: window.location.pathname,
    })

    if (status === 401 && !isGuestPath) {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default instance
