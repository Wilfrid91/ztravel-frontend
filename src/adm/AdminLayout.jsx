import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import ASIDE from './ASIDE'
import axios from 'axios'
import Header from '../components/Header/Header.jsx'
import layout from '../css/adminLayout.module.css'

export default function AdminLayout() {
  const navigate = useNavigate() // OBLIGATOIRE

  const [selectedMenu, setSelectedMenu] = useState(null)
  const [menuData, setMenuData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  /*const handleMenuClick = async (child) => {
    if (!child || !child.endpoint) return

    setSelectedMenu(child)
    // Tous les endpoints sont passés  dans AdminMenu.js
    const res = await axios.get(child.endpoint)
    console.log('############ ALL PAYMENTS', res)
    setMenuData(res.data)
  }*/
  const handleMenuClick = async (child) => {
    if (!child || !child.endpoint) return

    setIsLoading(true)
    setError(null)
    setSelectedMenu(child)

    try {
      const res = await axios.get(child.endpoint)
      console.log('############ ALL PAYMENTS', res)
      setMenuData(res.data)
    } catch (err) {
      console.error(err)
      setError('Impossible de charger les données')
    } finally {
      setIsLoading(false)
    }
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
