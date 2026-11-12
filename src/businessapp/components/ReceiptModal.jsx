import styles from '../../styles/PaymentModal.module.css'

const ReceiptModal = ({ onClose, children }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        <div className={styles.header}>
          <h2 className={styles.title}>Recu de paiement</h2>
          <p className={styles.subtitle}>
            Comment voulez rececoir votre reçu de paiement?
          </p>
        </div>
        {/**Ici, on passe le bouton */}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}

export default ReceiptModal
