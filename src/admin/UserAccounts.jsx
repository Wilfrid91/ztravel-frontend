import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import axios from '../utils/axiosInstance'
import styles from '../styles/UserAccounts.module.css'

export default function UserAccounts() {
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState({})
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  /*
   * ============================
   * CHARGEMENT DES UTILISATEURS
   * ============================
   */

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)

        const res = await axios.get('/api/v1/auth/admin/users')

        console.log('USERS:', res.data)

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.users || res.data?.data || []

        setUsers(data)
      } catch (err) {
        console.error('Erreur chargement utilisateurs:', err)

        const status = err.response?.status

        if (status === 403) {
          toast.error('Accès refusé. Administrateur requis.')
        } else if (status !== 401) {
          toast.error('Impossible de charger les utilisateurs.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  /*
   * ============================
   * UTILISATEURS FILTRÉS
   * ============================
   */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return users
    }

    return users.filter((user) => {
      return (
        user.nom?.toLowerCase().includes(query) ||
        user.prenom?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query) ||
        user.status?.toLowerCase().includes(query)
      )
    })
  }, [users, search])

  /*
   * ============================
   * SÉLECTION
   * ============================
   */

  const selectedIds = Object.keys(selected).filter((id) => selected[id])

  const singleSelected = selectedIds.length === 1 ? selectedIds[0] : null

  const allFilteredSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((user) => selected[user._id])

  /*
   * ============================
   * SÉLECTION D'UN UTILISATEUR
   * ============================
   */

  const handleSelectUser = (id, checked) => {
    setSelected((prev) => ({
      ...prev,
      [id]: checked,
    }))
  }

  /*
   * ============================
   * TOUT SÉLECTIONNER
   * ============================
   */

  const handleSelectAll = (checked) => {
    const newState = { ...selected }

    filteredUsers.forEach((user) => {
      newState[user._id] = checked
    })

    setSelected(newState)
  }

  /*
   * ============================
   * DÉSACTIVER
   * ============================
   */

  const disableUser = async () => {
    if (!singleSelected) {
      return
    }

    const user = users.find((item) => item._id === singleSelected)

    if (!user) {
      return
    }

    const confirmed = window.confirm(
      `Voulez-vous vraiment désactiver le compte de ${user.prenom || ''} ${user.nom || ''} ?`,
    )

    if (!confirmed) {
      return
    }

    try {
      setActionLoading(true)

      await axios.delete(`/api/v1/auth/admin/disable/${singleSelected}`)

      toast.success('Utilisateur désactivé avec succès.')

      /*
       * Mise à jour locale
       */
      setUsers((prev) =>
        prev.map((item) =>
          item._id === singleSelected
            ? {
                ...item,
                status: 'disabled',
              }
            : item,
        ),
      )

      /*
       * Retirer de la sélection
       */
      setSelected((prev) => {
        const next = { ...prev }
        delete next[singleSelected]
        return next
      })
    } catch (err) {
      console.error('Erreur désactivation utilisateur:', err)

      const msg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        'Erreur inconnue'

      toast.error(`Erreur lors de la désactivation : ${msg}`)
    } finally {
      setActionLoading(false)
    }
  }

  /*
   * ============================
   * EXPORT CSV
   * ============================
   */

  const exportUsers = () => {
    const usersToExport =
      selectedIds.length > 0
        ? users.filter((user) => selectedIds.includes(user._id))
        : filteredUsers

    if (usersToExport.length === 0) {
      toast.info('Aucun utilisateur à exporter.')

      return
    }

    const headers = [
      'Nom',
      'Prénom',
      'Email',
      'Statut',
      'Rôle',
      'Dernière connexion',
    ]

    const rows = usersToExport.map((user) => [
      user.nom || '',
      user.prenom || '',
      user.email || '',
      user.status || '',
      user.role || '',
      user.lastLogin
        ? new Date(user.lastLogin).toLocaleString('fr-FR')
        : 'Jamais connecté',
    ])

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(';'),
      )
      .join('\n')

    const blob = new Blob(['\ufeff' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url

    link.download = `utilisateurs-${new Date().toISOString().slice(0, 10)}.csv`

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(url)

    toast.success(`${usersToExport.length} utilisateur(s) exporté(s).`)
  }

  /*
   * ============================
   * STATISTIQUES
   * ============================
   */

  const totalUsers = users.length

  const activeUsers = users.filter(
    (user) => user.status?.toLowerCase() === 'active',
  ).length

  const disabledUsers = users.filter(
    (user) => user.status?.toLowerCase() === 'disabled',
  ).length

  const adminUsers = users.filter(
    (user) => user.role?.toLowerCase() === 'admin',
  ).length

  /*
   * ============================
   * STATUT
   * ============================
   */

  const getStatusClass = (status) => {
    const value = status?.toLowerCase()

    if (value === 'active' || value === 'actif') {
      return styles.statusActive
    }

    if (value === 'disabled' || value === 'inactive' || value === 'inactif') {
      return styles.statusDisabled
    }

    return styles.statusDefault
  }

  /*
   * ============================
   * ROLE
   * ============================
   */

  const getRoleClass = (role) => {
    if (role?.toLowerCase() === 'admin') {
      return styles.roleAdmin
    }

    return styles.roleUser
  }

  /*
   * ============================
   * CHARGEMENT
   * ============================
   */

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader} />

        <p>Chargement des utilisateurs...</p>
      </div>
    )
  }

  /*
   * ============================
   * INTERFACE
   * ============================
   */

  return (
    <div className={styles.container}>
      {/* =========================
          HEADER
      ========================= */}

      <div className={styles.pageHeader}>
        <div>
          <div className={styles.titleRow}>
            <div className={styles.pageIcon}>👥</div>

            <div>
              <h1>Comptes utilisateurs</h1>

              <p>Gestion des comptes et des accès utilisateurs.</p>
            </div>
          </div>
        </div>

        <button
          type='button'
          className={styles.exportButton}
          onClick={exportUsers}
          disabled={filteredUsers.length === 0}
        >
          ↓<span>Exporter CSV</span>
        </button>
      </div>

      {/* =========================
          STATISTIQUES
      ========================= */}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>

          <div>
            <span>Total utilisateurs</span>

            <strong>{totalUsers}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconActive}>✓</div>

          <div>
            <span>Actifs</span>

            <strong>{activeUsers}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconDisabled}>×</div>

          <div>
            <span>Désactivés</span>

            <strong>{disabledUsers}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconAdmin}>★</div>

          <div>
            <span>Administrateurs</span>

            <strong>{adminUsers}</strong>
          </div>
        </div>
      </div>

      {/* =========================
          TABLE CARD
      ========================= */}

      <div className={styles.tableCard}>
        {/* TOOLBAR */}

        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>⌕</span>

            <input
              type='text'
              placeholder='Rechercher un utilisateur...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type='button'
                className={styles.clearSearch}
                onClick={() => setSearch('')}
              >
                ×
              </button>
            )}
          </div>

          <div className={styles.toolbarActions}>
            <button
              type='button'
              className={styles.disableButton}
              disabled={singleSelected === null || actionLoading}
              onClick={disableUser}
            >
              {actionLoading ? 'Désactivation...' : 'Désactiver'}
            </button>

            <button
              type='button'
              className={styles.toolbarExport}
              disabled={filteredUsers.length === 0}
              onClick={exportUsers}
            >
              Exporter
            </button>
          </div>
        </div>

        {/* TABLE HEADER */}

        <div className={styles.tableHeader}>
          <div>
            <h2>Liste des utilisateurs</h2>

            <p>
              {filteredUsers.length} utilisateur
              {filteredUsers.length > 1 ? 's' : ''}
              {search ? ' trouvé(s)' : ''}
            </p>
          </div>

          {selectedIds.length > 0 && (
            <div className={styles.selectionInfo}>
              {selectedIds.length} sélectionné
              {selectedIds.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* =========================
            EMPTY
        ========================= */}

        {users.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👥</div>

            <h3>Aucun utilisateur</h3>

            <p>Aucun compte utilisateur n'est actuellement disponible.</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⌕</div>

            <h3>Aucun résultat</h3>

            <p>Aucun utilisateur ne correspond à votre recherche.</p>
          </div>
        ) : (
          /* =========================
             TABLE
          ========================= */

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkboxColumn}>
                    <input
                      type='checkbox'
                      checked={allFilteredSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>

                  <th>Utilisateur</th>

                  <th>Email</th>

                  <th>Statut</th>

                  <th>Rôle</th>

                  <th>Dernière connexion</th>

                  <th>ID</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className={selected[user._id] ? styles.selectedRow : ''}
                  >
                    {/* CHECKBOX */}

                    <td className={styles.checkboxColumn}>
                      <input
                        type='checkbox'
                        checked={selected[user._id] || false}
                        onChange={(e) =>
                          handleSelectUser(user._id, e.target.checked)
                        }
                      />
                    </td>

                    {/* UTILISATEUR */}

                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>
                          {(
                            user.prenom?.[0] ||
                            user.nom?.[0] ||
                            '?'
                          ).toUpperCase()}
                        </div>

                        <div className={styles.userIdentity}>
                          <strong>
                            {user.prenom || '—'} {user.nom || ''}
                          </strong>

                          <span>{user.username || user.email || '—'}</span>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}

                    <td>
                      <span className={styles.email}>{user.email || '—'}</span>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={`${styles.statusBadge} ${getStatusClass(
                          user.status,
                        )}`}
                      >
                        <span className={styles.statusDot} />

                        {user.status || '—'}
                      </span>
                    </td>

                    {/* ROLE */}

                    <td>
                      <span
                        className={`${styles.roleBadge} ${getRoleClass(
                          user.role,
                        )}`}
                      >
                        {user.role || 'user'}
                      </span>
                    </td>

                    {/* LAST LOGIN */}

                    <td>
                      <div className={styles.lastLogin}>
                        {user.lastLogin ? (
                          <>
                            <strong>
                              {new Date(user.lastLogin).toLocaleDateString(
                                'fr-FR',
                              )}
                            </strong>

                            <span>
                              {new Date(user.lastLogin).toLocaleTimeString(
                                'fr-FR',
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                },
                              )}
                            </span>
                          </>
                        ) : (
                          <span className={styles.neverLogin}>
                            Jamais connecté
                          </span>
                        )}
                      </div>
                    </td>

                    {/* ID */}

                    <td>
                      <span className={styles.userId} title={user._id}>
                        {user._id ? `${user._id.slice(0, 8)}...` : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FOOTER */}

        {filteredUsers.length > 0 && (
          <div className={styles.tableFooter}>
            <span>
              Affichage de <strong>{filteredUsers.length}</strong> sur{' '}
              <strong>{users.length}</strong> utilisateur
              {users.length > 1 ? 's' : ''}
            </span>

            {selectedIds.length > 0 && (
              <span>
                {selectedIds.length} sélectionné
                {selectedIds.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
