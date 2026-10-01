import React from 'react'
import styles from '../../styles/UserDashboard.module.css'

const UserDashboard = ({ tx }) => {
  if (!tx) return null

  return (
    <>
      <td className={styles.userDashboardCell}>
        {new Date(tx.createdAt).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </td>

      <td className={styles.userDashboardCell}>{tx.transactionId}</td>
      <td className={styles.userDashboardCell}>{tx.amount}</td>
      <td className={styles.userDashboardCell}>{tx.status}</td>
      <td className={styles.userDashboardCell}>{tx.brand}</td>
      <td className={styles.userDashboardCell}>{tx.country}</td>
      <td className={styles.userDashboardCell}>{tx.method}</td>
      <td className={styles.userDashboardCell}>{tx.number}</td>
      <td className={styles.userDashboardCell}>
        <span className={styles.email}>{tx.customerEmail || '—'}</span>
      </td>
      <td className={styles.userDashboardCell}>
        <span className={styles.ip}>{tx.ip || '—'}</span>
      </td>
      <td className={styles.userDashboardCell}>{tx.region || '—'}</td>
    </>
  )
}

export default UserDashboard
