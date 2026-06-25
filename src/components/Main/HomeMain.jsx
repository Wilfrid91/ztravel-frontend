import React, { useState } from 'react'
import { MENU_ITEMS } from '../../data/HomePage.js'
import styles from '../../css/HomeLayout.module.css'
import Header from '../Header/Header.jsx'

const HomeMain = ({ activeNav, setActiveNav }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const activeMenu = MENU_ITEMS.find((item) => item.id === activeNav)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className={styles.layoutContainer}>
      {/* HEADER avec bouton burger */}
      <Header onMenuToggle={toggleSidebar} />
      {/* Colonne gauche */}

      {/* OVERLAY (fond sombre) */}
      <div
        className={`${styles.sidebarOverlay} ${
          sidebarOpen ? styles.sidebarOverlayActive : ''
        }`}
        onClick={closeSidebar}
      />
      <div className={styles.contentWrapper}>
        {/* SIDEBAR */}
        <aside
          className={`${styles.sidebar} ${
            sidebarOpen ? styles.sidebarOpen : ''
          }`}
        >
          <nav className={styles.menu}>
            <ul className={styles.navList}>
              {MENU_ITEMS.map(({ id, title }) => (
                <li key={id} className={styles.navItem}>
                  <button
                    className={`${styles.navLink} ${
                      activeNav === id ? styles.active : ''
                    }`}
                    onClick={() => {
                      setActiveNav(id)
                      closeSidebar() // ferme la sidebar sur mobile
                    }}
                  >
                    {title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.layoutMain}>
          <div>
            <h2 className={styles.heroTitle}>
              Bienvenue sur ZTravel Import © - Achetez malin, rentrez serein! —
              votre référence pour l’accompagnement commercial en Chine, et bien
              plus.
            </h2>

            <ol className={styles.introList}>
              <li>
                <span>Guides & tutoriels</span> pour préparer efficacement votre
                déplacement.
              </li>
              <li>
                <span>Accompagnement fournisseurs</span> pour identifier et
                sélectionner des partenaires fiables.
              </li>
              <li>
                <span>Logistique & transitaires</span> pour organiser
                l’expédition et le suivi.
              </li>
              <li>
                <span>Génération de la liste de produits</span> pour créer
                automatiquement vos fiches produits.
              </li>
              <li>
                <span>Simulation des droits de douane</span> afin d’évaluer la
                rentabilité avant décision.
              </li>
            </ol>
          </div>

          {activeMenu && (
            <div className={styles.featuresGrid}>
              {activeMenu.cards.map((card, index) => (
                <div
                  key={index}
                  className={styles.featureCard}
                  style={{ '--card-color': card.color }}
                >
                  <div className={styles.featureIcon}>{card.icon}</div>
                  <h3 className={styles.featureTitle}>
                    {card.title || 'Titre'}
                  </h3>
                  <div className={styles.featureContent}>
                    {card.content.map((item, i) => (
                      <p key={i} className={styles.featureDescription}>
                        {item}
                      </p>
                    ))}
                  </div>
                  <a
                    href={card.link}
                    className={styles.featureBtn}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    En savoir plus
                  </a>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>© 2026 ZTravel Consulting — All rights reserved</p>
      </footer>
    </div>
  )
}

export default HomeMain
