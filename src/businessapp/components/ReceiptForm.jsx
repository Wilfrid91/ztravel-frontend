import React from 'react'
import { toast } from 'react-toastify'
import PaymentModal from './PaymentModal'
import axios from '../../utils/axiosInstance'
import styles from '../../styles/ReceiptForm.module.css'

const ReceiptForm = ({ data, onClose, onDataReceived }) => {
  const handlePrint = () => {
    if (!data?.pdfBlob) {
      toast.error('Aucun PDF trouvé')
      return
    }
    const url = URL.createObjectURL(data.pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Ticket-client-${data.user?.nom || 'client'}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleEmail = async () => {
    try {
      await axios.post('/api/v1/payment/send-email', {
        referenceId: data.referenceId,
      })
      toast.success('Reçu envoyé par email')
      onDataReceived(data)
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de l'envoi de l'email")
    }
  }

  return (
    <PaymentModal onClose={onClose}>
      <div className={styles.container}>
        <h2>Reçu client</h2>
        <button onClick={handlePrint} className={styles.btn}>
          Imprimer en PDF
        </button>
        <button onClick={handleEmail} className={styles.btn}>
          Envoyer par email
        </button>
      </div>
    </PaymentModal>
  )
}

export default ReceiptForm
