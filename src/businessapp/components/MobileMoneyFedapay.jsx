import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import PaymentModal from './PaymentModal'
import axios from '../../utils/axiosInstance'
import styles from '../../styles/MobileMoney.module.css'

const MobileMoneyFedapay = ({ onClose, onDataReceived }) => {
  const { user } = useAuth()
  const [phone, setPhone] = useState('')
  const amount = 5999
  const currency = 'XOF'
  const description =
    "Payer 5999 FCFA pour la génération de la liste des produits et la simulation de l'attestation de vérification documentaire"

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      amount: amount,
      currency: currency,
      phone: phone,
      description: description,
      firstname: user?.prenom || '',
      lastname: user?.nom || '',
      email: user?.email || '',
    }

    try {
      const response = await axios.post(
        '/api/v1/payment/credit-card/fedapay/create',
        {
          payload,
          callback_url: null,
        },
      )
      console.log('Paiement envoyé :', response.data)
      localStorage.setItem(
        'fedapay_transaction_id',
        response.data.transactionId,
      )
      onDataReceived({
        paymentUrl: response.data.paymentUrl,
        transactionId: response.data.transactionId,
        referenceId: response.data.referenceId,
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
        <h2>Paiement Carte de crédit</h2>

        <div className={styles.field}>
          <label>Montant</label>
          <input type='text' value={`${amount} ${currency}`} disabled />
        </div>

        <div className={styles.field}>
          <label>Numéro de téléphone</label>
          <input
            type='text'
            placeholder='Ex: 64000001 ou 66000001'
            value={phone}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9+]/g, '')
              setPhone(value)
            }}
            maxLength={15}
          />
        </div>

        <div className={styles.field}>
          <label>Description</label>
          <textarea value={description} disabled rows={3} />
        </div>

        <button type='submit' className={styles.submitBtn}>
          Payer avec FedaPay
        </button>
      </form>
    </PaymentModal>
  )
}

export default MobileMoneyFedapay
