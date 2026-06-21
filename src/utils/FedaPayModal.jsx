function FedaPayModal({ onClose, children }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '420px',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    border: 'none',
    background: 'transparent',
    fontSize: '22px',
    cursor: 'pointer',
  },
}

export default FedaPayModal
