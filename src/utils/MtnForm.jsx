import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const MtnForm = ({ OnDataReceived }) => {
  const [phone, setPhone] = useState('')
  const amount = 5999
  const currency = 'EUR' // XOF en prod
  const message = 'Veuillez Payer 5999 FCFA'
  const payeeMessage = 'Merci'

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Vérification simple : 8 chiffres
    if (!/^\d{9}$/.test(phone)) {
      alert('Veuillez entrer un numéro de téléphone valide (8 chiffres).')
      return
    }

    const payload = {
      amount,
      currency,
      payer: {
        partyIdType: 'MSISDN',
        partyId: `229${phone}`, // format final envoyé à MoMo
      },
      payerMessage: message,
      payeeNote: payeeMessage,
    }

    console.log('Données du paiement :', payload)

    try {
      const response = await axios.post(
        '/api/v1/payment/collection/requestToPay',
        {
          payload,
        },
      )
      console.log('Paiement envoyé :', response.data)
      OnDataReceived({
        referenceId: response.data.referenceId,
      })

      // Fermer le modal immédiatement
      //onClose()
      //console.log('RESULT', ...response.data.result)
      console.log('TOKEN', response.data.token)
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
      <h2>Paiement Mobile Money</h2>

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

      {/* Numéro de téléphone */}
      <div>
        <label>Numéro de téléphone</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type='text'
            value='+229'
            disabled
            style={{ width: '110px', padding: '10px' }}
          />
          <input
            type='text'
            placeholder='9 chiffres'
            maxLength={9}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ flex: 1, padding: '10px' }}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label>Message</label>
        <textarea
          value={message}
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
        Procéder au paiement
      </button>
    </form>
  )
}

export default MtnForm
