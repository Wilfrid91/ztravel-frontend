import React, { useState } from 'react'
import { useMenuData } from '../hooks/useMenuData' // He() dans le build

export default function UserData() {
  const { menuData } = useMenuData()
  const [page, setPage] = useState(1)

  console.log('Rendering UserPaymentData with menuData:', menuData)

  if (!menuData || !Array.isArray(menuData)) {
    return <p>Aucun paiement trouvé.</p>
  }

  if (menuData.length === 0) {
    return <div>Aucun paiement trouvé.</div>
  }

  const totalPages = Math.ceil(menuData.length / 50)
  const start = (page - 1) * 50
  const end = start + 50
  const slice = menuData.slice(start, end)

  const changePage = (newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)))
  }

  return (
    <>
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px',
        }}
      >
        <button
          onClick={() => changePage(page - 1)}
          disabled={page === 1}
          style={{ padding: '8px 16px' }}
        >
          Précédent
        </button>

        <span>
          Page {page} sur {totalPages} ({menuData.length} transactions)
        </span>

        <button
          onClick={() => changePage(page + 1)}
          disabled={page === totalPages}
          style={{ padding: '8px 16px' }}
        >
          Suivant
        </button>
      </div>

      <table
        border='1'
        cellPadding='8'
        style={{ width: '100%', borderCollapse: 'collapse' }}
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>ID Transaction</th>
            <th>Montant</th>
            <th>Status</th>
            <th>Brand</th>
            <th>Pays</th>
            <th>Méthode</th>
            <th>Numéro</th>
            <th>Email client</th>
            <th>IP</th>
            <th>Région</th>
          </tr>
        </thead>

        <tbody>
          {slice.map((e) => (
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

              <td>{e.transactionId || '—'}</td>
              <td>{e.amount || '—'}</td>
              <td>{e.status || '—'}</td>
              <td>{e.brand || '—'}</td>
              <td>{e.country || '—'}</td>
              <td>{e.method || '—'}</td>
              <td>{e.number || '—'}</td>
              <td>{e.customerEmail || '—'}</td>
              <td>{e.ip || '—'}</td>
              <td>{e.region || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
