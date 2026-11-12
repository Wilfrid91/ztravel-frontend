import React from 'react'
import { toast } from 'react-toastify'
import ReceiptModal from './ReceiptModal'
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
    link.download = `Ticket-client-${data.user?.prenom || 'client'}.pdf`
    link.click()
    URL.revokeObjectURL(url)
    // Une fois l'impression terminée, veux revenir à '/businessapp'
    // Fermer la modale puis notifier le parent
    //onClose()
    //onAfterPrint?.()
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
    // Une fois l'impression terminée, veux revenir à '/businessapp'
    // Fermer la modale puis notifier le parent
    // onClose()
    //onAfterPrint?.()
  }

  return (
    <ReceiptModal onClose={onClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>Reçu client</h2>
        <div className={styles.actions}>
          <button onClick={handlePrint} className={styles.btnPrimary}>
            Imprimer en PDF
          </button>
          <button onClick={handleEmail} className={styles.btnSecondary}>
            Envoyer par email
          </button>
        </div>
      </div>
    </ReceiptModal>
  )
}

export default ReceiptForm
