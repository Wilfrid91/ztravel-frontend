import styles from '../../styles/PaymentForm.module.css'
const PayerForm = ({ accepted, setAccepted, onSubmit }) => {
  return (
    <div className={styles.card}>
      <div className={styles.brand}>zTravel Consulting ©</div>
      <h2 className={styles.title}>Conditions générales</h2>
      <p className={styles.notice}>
        Avant de continuer, veuillez lire et accepter les{' '}
        <a
          className={styles.link}
          href='/pdf/conditions-générales.pdf'
          target='_blank'
          rel='noopener noreferrer'
        >
          <strong>conditions générales</strong>
        </a>{' '}
        de zTravel Consulting ©
      </p>
      <label className={styles.acceptRow}>
        <input
          type='checkbox'
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
        J'ai lu et j'accepte les conditions générales
      </label>

      <div className={styles.actions}>
        <button
          type='button'
          onClick={onSubmit}
          disabled={!accepted}
          className={styles.acceptBtn}
        >
          Accepter et continuer
        </button>
      </div>
    </div>
  )
}
export default PayerForm
