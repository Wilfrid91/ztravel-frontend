import React from 'react'
import styles from '../../styles/PaymentModal.module.css'

const PaymentModal = ({ onClose, children }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Interface de paiement</h2>
          <p className={styles.subtitle}>
            Merci de sélectionner votre méthode de paiement préférée
          </p>
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}

export default PaymentModal
