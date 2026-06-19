import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import ASIDE from './ASIDE'
import axios from 'axios'
import { useGlobalContext } from '../context.js'
import Header from '../components/Header/Header.jsx'
import layout from '../css/adminLayout.module.css'

export default function AdminLayout() {
  const navigate = useNavigate() // OBLIGATOIRE

  const location = useLocation()

  const [selectedMenu, setSelectedMenu] = useState(null)
  const [menuData, setMenuData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setisLoading] = useState(false)

  const handleMenuClick = async (child) => {
    if (!child || !child.endpoint) return

    setSelectedMenu(child)
    // Tous les endpoints sont passés  dans AdminMenu.js
    const res = await axios.get(child.endpoint)
    console.log('############ ALL PAYMENTS', res)
    setMenuData(res.data)
  }

  return (
    <>
      <Header />
      <aside className={layout.sidebar}>
        <ASIDE navigate={navigate} handleMenuClick={handleMenuClick} />
      </aside>

      <main className={layout.layoutMain}>
        {isLoading && <div>Chargement...</div>}
        {error && <div>Erreur: {error}</div>}
        {!isLoading && !error && (
          <Outlet context={{ selectedMenu, menuData }} />
        )}
      </main>

      <footer className={layout.footer}>
        <p>© 2026 Zinsou App — All rights reserved</p>
      </footer>
    </>
  )
}
