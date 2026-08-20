import React, { useState } from 'react'
import { toast } from 'react-toastify'
import PaymentModal from './PaymentModal'
import axios from '../../utils/axiosInstance'
import styles from '../../styles/MobileMoney.module.css'

const MobileMoneyMtn = ({ onClose, onDataReceived }) => {
  const [phone, setPhone] = useState('')
  const amount = 5999
  const currency = 'EUR'
  const message = 'Veuillez Payer 5999 FCFA'

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!/^\d{9}$/.test(phone)) {
      toast.error('Veuillez entrer un numéro de téléphone valide (9 chiffres).')
      return
    }

    const payload = {
      amount: amount,
      currency: currency,
      payer: {
        partyIdType: 'MSISDN',
        partyId: `229${phone}`,
      },
      payerMessage: message,
      payeeNote: 'Merci',
    }

    try {
      const response = await axios.post(
        '/api/v1/payment/collection/requestToPay',
        {
          payload,
        },
      )
      console.log('Paiement envoyé :', response.data)
      onDataReceived({
        referenceId: response.data.referenceId,
        token: response.data.token,
      })
      onClose()
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expirée, veuillez vous authentifier')
      } else {
        toast.error(err.response?.data?.msg || 'Une erreur est survenue')
      }
    }
  }

  return (
    <PaymentModal onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Paiement Mobile Money</h2>

        <div className={styles.field}>
          <label>Montant</label>
          <input type='text' value={`${amount} ${currency}`} disabled />
        </div>

        <div className={styles.field}>
          <label>Numéro de téléphone</label>
          <div className={styles.phoneInput}>
            <input
              type='text'
              value='+229'
              disabled
              className={styles.prefix}
            />
            <input
              type='text'
              placeholder='9 chiffres'
              maxLength={9}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              className={styles.phoneNumber}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>Message</label>
          <textarea value={message} disabled rows={3} />
        </div>

        <button type='submit' className={styles.submitBtn}>
          Procéder au paiement
        </button>
      </form>
    </PaymentModal>
  )
}

export default MobileMoneyMtn
