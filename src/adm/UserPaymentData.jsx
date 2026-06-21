import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'

export default function UserPaymentData() {
  const { menuData } = useOutletContext()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  console.log(menuData)

  try {
    console.log('Rendering UserPaymentData with menuData:', menuData)
  } catch (e) {
    console.error('REAL ERROR:', e)
  }

  if (!menuData || !Array.isArray(menuData)) {
    return <p>Aucun paiement trouvé.</p>
  }
  if (menuData.length === 0) {
    return <div>Aucun paiement trouvé.</div>
  }

  //const transactions = menuData
  // Pagination
  const totalPages = Math.ceil(menuData.length / itemsPerPage)
  console.log('TOTAL PAGE=', totalPages)
  const startIndex = (currentPage - 1) * itemsPerPage // vaut 0
  const endIndex = startIndex + itemsPerPage // vaut 50
  // Page 1 : items 0 à 49 =>  // [t0, t1, ..., t49]
  // Page 2 : items 50 à 99 =>  // [t50, t1, ..., t99]
  // On peut aussi utiliser map, mais (mauvaise performance) =>  slice()
  const currentTransactions = menuData.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <>
      {/* Contrôles de pagination */}
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
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ padding: '8px 16px' }}
        >
          Précédent
        </button>
        <span>
          Page {currentPage} sur {totalPages} ({menuData.length} transactions)
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ padding: '8px 16px' }}
        >
          Suivant
        </button>
      </div>
      {/* Tableau */}
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
          {currentTransactions.map((tx) => (
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

              <td>{tx.transactionId || '—'}</td>
              <td>{tx.amount || '—'}</td>
              <td>{tx.status || '—'}</td>
              <td>{tx.brand || '—'}</td>
              <td>{tx.country || '—'}</td>
              <td>{tx.method || '—'}</td>
              <td>{tx.number || '—'}</td>
              <td>{tx.customerEmail || '—'}</td>
              <td>{tx.ip || '—'}</td>
              <td>{tx.region || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
