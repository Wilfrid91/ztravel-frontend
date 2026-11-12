import { useEffect, useState } from 'react'
import axios from '../../utils/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import styles from '../../styles/CheckCustomerToken.module.css'

const CheckCustomerToken = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading | ok | exhausted | error

  // handleSubmit() est appelé pendant le rendu
  // const handleSubmit = async (e) => {...}

  useEffect(() => {
    let cancelled = false // sécurité si le composant est démonté pendant la requête
    const checkToken = async () => {
      try {
        // si aboutit
        const response = await axios.get('/api/v1/business/customer-token')
        console.log('JETON =', response.data.jeton)
        if (!cancelled) {
          setStatus('Ok')
          navigate('/avd-simulator')
        }
      } catch (error) {
        if (cancelled) return

        const status = error.response?.status

        if (status === 403) {
          // Jetons épuisés → on EXPLIQUE et on propose la recharge
          toast.info(
            error.response.data?.message ||
              "Vous avez épuisé vos jetons d'impression.",
          )
          setStatus('exhausted')
        } else if (status === 401) {
          toast.error('Session expirée. Veuillez vous reconnecter.')
          setStatus('error')
        } else {
          toast.error('Erreur lors de la vérification de vos jetons.')
          setStatus('error')
        }
      }
    }
    checkToken()
    return () => {
      cancelled = true
    }
  }, [navigate])

  if (status === 'loading') {
    return <p className={styles.info}>Vérification de vos jetons…</p>
  }

  if (status === 'exhausted') {
    return (
      <div className={styles.exhaustedCard}>
        <p>Vous avez épuisé tous vos jetons d'impression.</p>
        <button
          className={styles.rechargeBtn}
          onClick={() => navigate('/TAB8-paiement')}
        >
          Recharger mon compte
        </button>
      </div>
    )
  }

  return null // redirection en cours, ou erreur déjà toastée
}

export default CheckCustomerToken
