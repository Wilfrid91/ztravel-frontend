import { useState } from 'react'
import { HOME_MENU } from '../data/HomePage.js'
import styles from '../styles/HomeMain.module.css'
import Header from '../businessapp/Header.jsx'
import Footer from '../businessapp/Footer.jsx'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../utils/axiosInstance'
import { toast } from 'react-toastify'

const HomeMain = () => {
  //const activeMenu = MENU_ITEMS.find((item) => item.id === activeNav)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const [isStarting, setIsStarting] = useState(false)

  const getAnonymousToken = async () => {
    // Utilisateur Freemium
    setIsStarting(true)

    try {
      const resp = await axios.post(
        '/api/v1/freemium/unregister', // body
        {}, // corps
        { withCredentials: true }, // options
      )

      console.log('Token anonyme obtenu :', resp.data)
      navigate('/avd-simulator')
    } catch (err) {
      const status = err.response?.status

      if (status === 401 || status === 403) {
        if (status === 403) {
          toast.info(
            err.response?.data?.error || 'Simulation gratuite déjà utilisée',
          )
        }
        navigate('/register', { replace: true })
        return
      }
      toast.error(err.response?.data?.error || err.message)
    } finally {
      setIsStarting(true)
    }
  }

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

        {/*<aside
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
        </aside>*/}
        {/* Colonne droite */}
        <section className={styles.container}>
          <div className={styles.hero}>
            {/* COLONNE GAUCHE : tout le texte */}
            <div className={styles.heroText}>
              <div className={styles.badges}>
                <span className={styles.badge}>SH 2022</span>
                <span className={styles.badge}>TEC CEDEAO</span>
                <span className={styles.badge}>UEMOA</span>
              </div>
              <h1>
                Calculez vos{' '}
                <strong className={styles.titleColor}>droits de douane</strong>{' '}
                en quelques clics
              </h1>
              <p>
                Simulez instantanément les droits et taxes à l'importation dans
                l'espace CEDEAO, à partir des tarifs officiels du Système
                Harmonisé et du Tarif Extérieur Commun. Pensé pour les
                importateurs, transitaires et entreprises.
              </p>
            </div>
            <div className={styles.featureCardSimulator}>
              <h3>Aperçu du simulateur</h3>
              <p className={styles.subTitle}>
                Résultat indicatif basé sur le TEC 2022
              </p>
              <div className={styles.field}>
                <label>Catégorie de produit</label>
                <select>
                  <option>Électronique (Chapitre 85 — SH)</option>
                  <option>Textiles & habillement</option>
                  <option>Produits alimentaires</option>
                  <option>Machines & équipements</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Pays de destination</label>
                <select>
                  <option>Bénin</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Valeur déclarée (FCFA)</label>
                <input type='text' value='1 000 000' />
              </div>
              <div className={styles.result}>
                <span className={styles.lab}>Droits + taxes estimés</span>
                <span className={styles.val}>≈ 245 000 FCFA</span>
              </div>
              <Link
                to='/avd-simulator'
                className={`${styles.featureBtn} ${styles.featureBtnAccent}`}
              >
                Démarrer maintenant
              </Link>
            </div>
          </div>
        </section>
        <section className={styles.container}>
          <div className={styles.featureTitle}>
            <div className={styles.steps}>
              <h2>Comment ça marche</h2>
              <p className={styles.lead}>
                Trois étapes simples, sans expertise douanière requise
              </p>
              <div className={styles.grid3}>
                <div className={styles.step}>
                  <div className={styles.num}>1</div>
                  <div className={styles.featureContent}>
                    <h3 className={styles.featureTitle}>
                      Décrivez votre produit
                    </h3>
                    <span>
                      Saisissez la nature du bien ou son code SH, la liste des
                      produits est générée automatiquement
                    </span>
                  </div>
                </div>

                <div className={styles.step}>
                  <div className={styles.num}>2</div>
                  <div className={styles.featureContent}>
                    <h3 className={styles.featureTitle}>Calcul automatique</h3>
                    <span>
                      Le simulateur applique le TEC et les taxes nationales en
                      vigueur dans le pays de destination
                    </span>
                  </div>
                </div>

                <div className={styles.step}>
                  <div className={styles.num}>3</div>
                  <div className={styles.featureContent}>
                    <h3 className={styles.featureTitle}>
                      Obtenez le détail des frais
                    </h3>
                    <span>
                      Droits de douane, TVA, statistique, prélèvements
                      communautaires — avec un récapitulatif exportable
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.container} id='services'>
          <div>
            <h2 className={styles.heroTitle}>
              Simplifiez vos importations depuis la Chine et à l'international
            </h2>
            <div className={styles.featuresGrid}>
              {HOME_MENU.map(({ icon, title, text }) => (
                <div key={title} className={styles.featureCard}>
                  <span className={styles.featureIcon}>{icon}</span>

                  {/* Colonne de droite : tout le contenu texte + bouton */}
                  <div className={styles.featureContent}>
                    <h3 className={styles.featureTitle}>{title}</h3>
                    <span>{text}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className={styles.sources}>
              Sources :{' '}
              <a
                href='/pdf/BJ-Tarif-Douanier-SH2022-a-jour_2.0.pdf'
                target='_blank'
                rel='noopener noreferrer'
              >
                <strong>BJ-Tarif-Douanier-SH2022-a-jour_2.0.pdf</strong>
              </a>
              {' | '}
              <a
                href='/pdf/UEMOA_TEC2022_V4.pdf'
                target='_blank'
                rel='noopener noreferrer'
              >
                <strong>UEMOA_TEC2022_V4.pdf</strong>
              </a>
            </p>
          </div>
        </section>
        {/*}
        <main className={styles.mainContent}>
          <div>
            <div>
              <h2 className={styles.heroTitle}>
                Simplifiez vos importations depuis la Chine et à
                l'international.
              </h2>

              <div className={styles.featuresGrid}>
                {HOME_MENU.map(({ icon: Icon, title, text }) => (
                  <div key={title} className={styles.featureCard}>
                    <Icon className={styles.featureIcon} />
                    <h3 className={styles.featureTitle}>{title}</h3>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

             {activeMenu && (
              <section className='hero container' id='etapes'>
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
              </section>
            )}
          </div>
        </main>
        */}
      </div>
      <section id='simulateur'>
        <div className={styles.cta}>
          <h2>Prêt à estimer vos frais d'importation ?</h2>
          <p>
            Lancez votre première simulation, c'est gratuit et sans inscription.
          </p>
          {/*<Link
            to='/avd-simulator'
            className={`${styles.featureBtn} ${styles.featureBtnAccent}`}
          >
            Démarrer maintenant
          </Link>*/}
          <button
            onClick={getAnonymousToken}
            disabled={isStarting}
            className={`${styles.featureBtn} ${styles.featureBtnAccent}`}
          >
            {isStarting ? 'Chargement...' : 'Démarrer maintenant'}
          </button>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default HomeMain
