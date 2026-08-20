import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import Sidebar from './Sidebar'
import { useMenuDataContext } from '../hooks/useMenuData' // ot() dans le build

export default function AdminLayout() {
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [menuData, setMenuData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleMenuClick = async (menu) => {
    if (!menu.endpoint) return

    setLoading(true)
    setError(null)
    setSelectedMenu(menu)

    try {
      const res = await axios.get(menu.endpoint)
      setMenuData(res.data)
    } catch (err) {
      setError('Impossible de charger les données')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Sidebar handleMenuClick={handleMenuClick} />

      <main style={{ padding: 20 }}>
        {loading && <div>Chargement...</div>}
        {error && <div>Erreur : {error}</div>}
        {!loading && !error && <Outlet context={{ selectedMenu, menuData }} />}
      </main>

      <footer style={{ marginTop: 40, textAlign: 'center' }}>
        © 2026 Zinsou App — All rights reserved
      </footer>
    </>
  )
}
