import React from 'react'

import styles from '../../styles/TokenDashboard.module.css'

const TokenDashboard = ({ tx }) => {
  if (!tx) return null

  const date = tx.createdAt
    ? new Date(tx.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

  const total = Number(tx.jetons_total) || 0
  const remaining = Number(tx.jetons_restants) || 0
  const impressions = Number(tx.nbre_impressions) || 0

  const usage =
    total > 0
      ? Math.min(100, Math.round(((total - remaining) / total) * 100))
      : 0

  return (
    <>
      {/* DATE */}
      <td className={`${styles.cell} ${styles.dateCell}`}>{date}</td>

      {/* TOTAL */}
      <td className={styles.cell}>
        <span className={styles.totalTokens}>
          {total.toLocaleString('fr-FR')}
        </span>
      </td>

      {/* RESTANTS */}
      <td className={styles.cell}>
        <div className={styles.remainingWrapper}>
          <div className={styles.remainingHeader}>
            <span className={styles.remainingTokens}>
              {remaining.toLocaleString('fr-FR')}
            </span>

            <span className={styles.remainingPercent}>
              {total > 0 ? `${100 - usage}% restants` : '—'}
            </span>
          </div>

          <div className={styles.progressContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${100 - usage}%` }}
            />
          </div>
        </div>
      </td>

      {/* IMPRESSIONS */}
      <td className={styles.cell}>
        <span className={styles.impressions}>
          {impressions.toLocaleString('fr-FR')}
        </span>
      </td>
    </>
  )
}

export default TokenDashboard
