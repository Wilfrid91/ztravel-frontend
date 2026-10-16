import { useRef, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from '../utils/axiosInstance' //  Ajoute withCredentials dans la requête axios pour les protected authentification middleware

export default function PaymentProcessing() {
  const [params] = useSearchParams()
  const transactionId = params.get('transactionId')
  const navigate = useNavigate()

  /**
   * handledRef.current persiste entre les rendus.
   * checking évite les appels simultanés au backend.
   * replace: true évite de conserver la page d'attente dans l'historique.
   * Le simulateur s'affiche sans attendre la génération du PDF.
   */

  const handledRef = useRef(false)
  useEffect(() => {
    if (!transactionId) return

    let cancelled = false
    let checking = false

    const checkPayment = async () => {
      if (cancelled || checking || handledRef.current) return

      checking = true

      try {
        const res = await axios.get(`/api/v1/payment/fedapay/${transactionId}`)

        if (cancelled) return

        if (res.data.status === 'approved') {
          handledRef.current = true

          // Arrêter immédiatement le polling
          clearInterval(interval)

          /*Retourner au simulateur
          navigate('/avd-simulator', {
            replace: true,
            state: {
              ticketReference: res.data.referenceId,
            },
          })*/
          navigate('/avd-simulator')
        } else if (res.data.status === 'failed') {
          handledRef.current = true
          clearInterval(interval)
          navigate('/payment-error', { replace: true })
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Erreur polling:', err)
        }
      } finally {
        checking = false
      }
    }

    const interval = setInterval(checkPayment, 2000)

    checkPayment()

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [transactionId, navigate])

  return (
    <div className='app-container'>
      <h1>Paiement en cours, veuillez patienter</h1>
      <p>Référence : {transactionId}</p>
    </div>
  )
}
