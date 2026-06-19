import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'

const JetonDashboard = ({ tx }) => {
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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row', // une seule ligne
    gap: '18px',
    padding: '20px',
    flexWrap: 'nowrap', // empêche le retour à la ligne
    overflowX: 'auto', // scroll horizontal
    alignItems: 'flex-start',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  textarea: {
    width: '100%',
    minHeight: '45px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    background: '#fafafa',
    fontSize: '14px',
    resize: 'vertical',
    color: '#444',
  },
}

export default JetonDashboard
