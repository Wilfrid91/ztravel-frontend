import { useOutletContext } from 'react-router-dom'

export default function RefundAllData({}) {
  const { menuData } = useOutletContext()

  console.log('MENU DATA', menuData)

  if (!menuData || !Array.isArray(menuData)) {
    return <p>Aucun paiement trouvé.</p>
  }

  const transactions = menuData

  return (
    <>
      <table
        border='1'
        cellPadding='8'
        style={{ width: '100%', borderCollapse: 'collapse' }}
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Référence ID du refund</th>
            <th>ID Paiement Initial</th>
            <th>Montant</th>
            <th>Status</th>
            <th>PSP</th>
            <th>Refund Paiement ID</th>
            <th>Devise</th>
            <th>Message</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>
                {tx.createdAt
                  ? new Date(tx.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </td>
              {/*tx.raw? => Si tx.raw existe, alors lis tx.raw.financialTransactionId. Sinon, ne plante pas, retourne undefined. » */}
              <td>{tx.reference || '—'}</td>
              <td>{tx.originalPaymentId || '—'}</td>
              <td>{tx.amount || '—'}</td>
              <td>{tx.status || '—'}</td>
              <td>{tx.provider || '—'}</td>
              <td>{tx.raw?.financialTransactionId ?? '—'}</td>
              <td>{tx.raw?.currency ?? '—'}</td>
              <td>{tx.raw?.payerMessage ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
