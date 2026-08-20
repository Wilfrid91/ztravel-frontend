import React, { useState } from 'react'
import { MENU_ITEMS } from '../data/HomePage.js'
import styles from '../styles/HomeMain.module.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
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
        <aside className={styles.sidebar}>
          <nav className={styles.menu}>
            <ul className={styles.navList}>
              {MENU_ITEMS.map(({ id, title }) => (
                <li key={id} className={styles.navItem}>
                  <button
                    className={`${styles.navLink} ${activeNav === id ? styles.active : ''}`}
                    onClick={() => setActiveNav(id)}
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
              <h3 className={styles.heroTitle}>
                Bienvenue sur la plateforme Zinsou Travel © — votre référence
                pour l’accompagnement commercial en Chine.
              </h3>

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
                          • {item}
                        </p>
                      ))}
                    </div>

                    <Link
                      to={card.link}
                      className={styles.featureBtn}
                      // target='_blank' ← Supprimez
                      // rel='noopener noreferrer' ← Supprimez
                    >
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
