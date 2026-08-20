import React from 'react'
import { useMenuData } from '../hooks/useMenuData' // He() dans le build

export default function RefundAll() {
  const { menuData } = useMenuData()

  console.log('MENU DATA', menuData)

  if (!menuData || !Array.isArray(menuData)) {
    return <p>Aucun paiement trouvé.</p>
  }

  const data = menuData

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
          {data.map((e) => (
            <tr key={e.id}>
              <td>
                {e.createdAt
                  ? new Date(e.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </td>

              <td>{e.reference || '—'}</td>
              <td>{e.originalPaymentId || '—'}</td>
              <td>{e.amount || '—'}</td>
              <td>{e.status || '—'}</td>
              <td>{e.provider || '—'}</td>

              <td>{e.raw?.financialTransactionId ?? '—'}</td>
              <td>{e.raw?.currency ?? '—'}</td>
              <td>{e.raw?.payerMessage ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
