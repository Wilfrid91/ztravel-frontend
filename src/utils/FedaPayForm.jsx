import axios from 'axios'
import { useState } from 'react'
import { useGlobalContext } from '../context.js'
import { toast } from 'react-toastify'

const FedaPayForm = ({ OnDataReceived }) => {
  // Numéro de télephone en test: +22961000000
  const { user } = useGlobalContext() // récupérer le usename
  const amount = 5999
  const currency = 'XOF' // XOF en prod
  const [phone, setPhone] = useState('')
  const description =
    "Payer 5999 FCFA pour la génération de la liste des produits et la simulation de l'attestation de vérification documentaire"
  const payeeMessage = 'Merci pour votre confiance!'

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      amount: 5999,
      currency: 'XOF',
      phone,
      description,
      firstname: user.prenom,
      lastname: user.nom,
      email: user.email,
    }

    console.log('Données du paiement :', payload)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/payment/credit-card/fedapay/create`,
        {
          payload,
          callback_url: null,
        },
      )

      console.log('Paiement envoyé :', response.data)
      OnDataReceived({
        paymentUrl: response.data.paymentUrl,
        transactionId: response.data.transactionId,
        referenceId: response.data.referenceId,
      })
      localStorage.setItem(
        'fedapay_transaction_id',
        response.data.transactionId,
      )

      if (response.data) {
        window.location.href = response.data.paymentUrl
      }
    } catch (error) {
      // Cas 1 : backend renvoie un message
      if (error.response?.status === 401) {
        toast.error('Session expirée, veuillez vous authentifier')
        return
      }
      // Cas 2 : autre erreur backend
      if (error.response?.data?.msg) {
        toast.error(error.response.data.msg)
        return
      }
      // Cas 3 : erreur réseau ou inconnue
      toast.error('Une erreur est survenue, veuillez réessayer')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <h2>Paiement Carte de crédit</h2>

      {/* Montant */}
      <div>
        <label>Montant</label>
        <input
          type='text'
          value={`${amount} ${currency}`}
          disabled
          style={{ width: '100%', padding: '10px' }}
        />
      </div>
      {/* Numéro de tél */}
      <div>
        <label>Numéro de tél.</label>
        <input
          type='text'
          value={phone}
          maxLength={15}
          onChange={(e) => {
            // Autoriser uniquement chiffres + "+"
            const value = e.target.value.replace(/[^0-9+]/g, '')

            // Empêcher plus d’un seul "+"
            const sanitized = value.startsWith('+')
              ? '+' + value.slice(1).replace(/\+/g, '')
              : value.replace(/\+/g, '')
            setPhone(e.target.value)
          }}
          placeholder='Ex: 64000001 ou 66000001 '
          style={{ width: '100%', padding: '10px' }}
        />
      </div>

      {/* Message */}
      <div>
        <label>description</label>
        <textarea
          value={description}
          disabled
          style={{ width: '100%', padding: '10px', height: '80px' }}
        />
      </div>

      <button
        type='submit'
        style={{
          padding: '12px',
          background: '#007aff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Payer avec FedaPay
      </button>
    </form>
  )
}

export default FedaPayForm
