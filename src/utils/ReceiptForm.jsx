import axios from 'axios'
import { toast } from 'react-toastify'

const ReceiptForm = ({ data, OnDataReceived }) => {
  // Handle the "printing button"
  const handlePrint = () => {
    console.log('Données reçues pour impression :', data)

    if (!data?.pdfBlob) {
      console.error('Aucun PDF trouvé dans data')
      return
    }
    const url = URL.createObjectURL(data.pdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Ticket-client-${data?.user?.nom || 'client'}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleEmail = async () => {
    console.log('Données reçues pour email :', data)
    OnDataReceived(data)

    try {
      const response = await axios.post('/api/v1/payment/send-email', {
        referenceId: data.referenceId, // important !
      })
      console.log('Email envoyé (ReceiptForm.jsx) composant :', response.data)
      toast.success('Reçu envoyé par email')
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de l'envoi de l'email")
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <h2>Reçu client</h2>

      <button
        type='button'
        onClick={handlePrint}
        style={{
          padding: '12px',
          background: '#007aff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Imprimer en PDF
      </button>

      <button
        type='button'
        onClick={handleEmail}
        style={{
          padding: '12px',
          background: '#007aff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Envoyer par email
      </button>
    </div>
  )
}

export default ReceiptForm
