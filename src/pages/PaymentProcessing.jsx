import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from '../utils/axiosInstance' //  Ajoute withCredentials dans la requête axios pour les protected authentification middleware

export default function PaymentProcessing() {
  const [params] = useSearchParams()
  const transactionId = params.get('transactionId')
  const navigate = useNavigate()

  useEffect(() => {
    if (!transactionId) return

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/payment/fedapay/${transactionId}`,
        )

        if (res.data.status === 'approved') {
          const pdfRes = await axios.post(
            `http://localhost:5000/api/v1/payment/credit-card/fedapay/print/${res.data.referenceId}`,
            {},
            { responseType: 'blob' },
          )

          const blob = pdfRes.data
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `recu_${res.data.referenceId}.pdf`
          a.click()

          clearInterval(interval)
          navigate('/avd-simulator')
        }

        if (res.data.status === 'failed') {
          clearInterval(interval)
          navigate('/payment-error')
        }
      } catch (err) {
        console.error('Erreur polling:', err)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [transactionId, navigate])

  return (
    <div className='app-container'>
      <h1>Paiement en cours…</h1>
      <p>Référence : {transactionId}</p>
    </div>
  )
}
