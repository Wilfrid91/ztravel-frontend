export default function SessionExpiree() {
  return (
    <div
      style={{
        padding: '40px',
        textAlign: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <h1>Session expirée</h1>
      <p style={{ marginTop: 10 }}>
        Votre session a expiré. Veuillez vous reconnecter pour continuer.
      </p>

      <button
        onClick={() => (window.location.href = '/login')}
        style={{
          marginTop: 20,
          padding: '12px 24px',
          background: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 16,
        }}
      >
        Se reconnecter
      </button>
    </div>
  )
}
