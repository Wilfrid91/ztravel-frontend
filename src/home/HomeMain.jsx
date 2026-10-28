import React, { useState } from 'react'
import { MENU_ITEMS } from '../data/HomePage.js'
import styles from '../styles/HomeMain.module.css'
import Header from '../businessapp/Header.jsx'
import Footer from '../businessapp/Footer.jsx'
import { Link } from 'react-router-dom'

const HomeMain = ({ activeNav, setActiveNav }) => {
  const activeMenu = MENU_ITEMS.find((item) => item.id === activeNav)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={styles.homeLayout}>
      {/* Header en pleine largeur */}
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      {/* Conteneur pour le reste (sidebar + contenu) */}

      <div className={styles.layoutWrapper}>
        {/* Overlay mobile — cliquer dessus referme le menu */}
        {sidebarOpen && (
          <button
            className={`${styles.sidebarOverlay} ${styles.sidebarOverlayActive}`}
            onClick={() => setSidebarOpen(false)}
            aria-label='Fermer le menu'
          />
        )}

        <aside
          className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}
        >
          <nav className={styles.menu}>
            <ul className={styles.navList}>
              {MENU_ITEMS.map(({ id, title }) => (
                <li key={id} className={styles.navItem}>
                  <button
                    className={`${styles.navLink} ${activeNav === id ? styles.active : ''}`}
                    onClick={() => {
                      setActiveNav(id)
                      setSidebarOpen(false) // ← referme le panneau après choix
                    }}
                  >
                    {title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        {/* Colonne droite */}
        <main className={styles.mainContent}>
          <div>
            <div>
              <h2 className={styles.heroTitle}>
                Simplifiez vos importations depuis la Chine et à
                l’international.
              </h2>

              <ol className={styles.introList}>
                <li>
                  <span>Guides & tutoriels</span> pour préparer efficacement
                  votre déplacement.
                </li>

                <li>
                  <span>Accompagnement fournisseurs</span> pour identifier et
                  sélectionner des partenaires fiables pour l’achat de vos
                  marchandises.
                </li>

                <li>
                  <span>Logistique & transitaires</span> pour organiser
                  l’expédition, la documentation et le suivi en temps réel de
                  votre conteneur.
                </li>

                <li>
                  <span>Génération de la liste de produits</span> pour créer
                  automatiquement vos fiches produits avec photos et détails
                  essentiels.
                </li>

                <li>
                  <span>Simulation des droits de douane</span> afin d’évaluer la
                  rentabilité de vos achats en Chine avant toute décision.
                </li>
              </ol>
              <h4 className={styles.heroTitle}>
                Les cartes ci-dessous récapitulent les étapes indispensables à
                la préparation de votre voyage en Chine. Avant de partir,
                assurez-vous que chacune d’elles a bien été validée.
              </h4>
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
                    <h3 className={styles.featureTitle}>{card.title}</h3>

                    <div className={styles.featureContent}>
                      {card.content.map((item, i) => (
                        <p key={i} className={styles.featureDescription}>
                          {item}
                        </p>
                      ))}
                    </div>

                    <Link to={card.link} className={styles.featureBtn}>
                      En savoir plus
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default HomeMain
