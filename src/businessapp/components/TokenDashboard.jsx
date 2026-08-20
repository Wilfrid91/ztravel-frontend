import React from 'react'

const TokenDashboard = ({ tx }) => {
  if (!tx) return null

  return (
    <>
      <td>
        {new Date(tx.createdAt).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </td>
      <td>{tx.jetons_total}</td>
      <td>{tx.jetons_restants}</td>
      <td>{tx.nbre_impressions}</td>
    </>
  )
}

export default TokenDashboard
