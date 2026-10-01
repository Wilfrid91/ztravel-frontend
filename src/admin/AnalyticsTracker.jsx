import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from '../utils/axiosInstance'

/**
 * Tracker qui observe les changements de route.
 * @returns
 */
export default function AnalyticsTracker() {
  const location = useLocation()

  useEffect(() => {
    const track = async () => {
      try {
        await axios.post('/api/v1/auth/track', {
          path: location.pathname,
        })
      } catch (error) {
        console.error('Erreur tracking:', error)
      }
    }

    track()
  }, [location.pathname])

  return null
}
