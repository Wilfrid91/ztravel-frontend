import React from 'react'
import styles from '../../styles/PaymentModal.module.css'

const PaymentModal = ({ onClose, children }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export default PaymentModal
