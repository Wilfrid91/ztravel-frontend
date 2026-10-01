import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../businessapp/Sidebar'
import GuideRenderer from './components/GuideRenderer'
import ProductCatalog from './components/ProductCatalog'
import ContactForm from './ContactForm'
import CGUModal from './components/CGUModal'
import PaymentModal from './components/PaymentModal'
import MobileMoneyMtn from './components/MobileMoneyMtn'
import MobileMoneyFedapay from './components/MobileMoneyFedapay'
import CreditCard from './components/CreditCard'
import ReceiptForm from './components/ReceiptForm'
import UserDashboard from './components/UserDashboard'
import TokenDashboard from './components/TokenDashboard'
import axios from '../utils/axiosInstance'
import styles from '../styles/BusinessApp.module.css'

const BusinessApp = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logoutUser } = useAuth()
  const [activeNav, setActiveNav] = useState('TAB1')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Données des différentes sections
  const [tab1Data, setTab1Data] = useState([])
  const [tab2Data, setTab2Data] = useState([])
  const [tab3Data, setTab3Data] = useState([])
  const [tab4Data, setTab4Data] = useState({})
  const [tab6Data, setTab6Data] = useState([])
  const [transactions, setTransactions] = useState([])
  const [tokens, setTokens] = useState([])

  // États des modales
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showMomoModal, setShowMobileMoneyFedapay] = useState(false)
  const [showCardModal, setShowMobileMoneyMtn] = useState(false)
  const [showCreditCardModal, setShowCreditCard] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showCGUModal, setShowCGUModal] = useState(false)
  const [cguAccepted, setCguAccepted] = useState(false)

  // États paiement
  const [paymentData, setPaymentData] = useState(null)
  const [receiptData, setReceiptData] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedImageCaption, setSelectedImageCaption] = useState('')

  const currentNav = activeNav

  // Redirection si non connecté
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Chargement des données TAB1
  useEffect(() => {
    if (!user || !location.pathname.startsWith('/businessapp')) return

    const fetchTab1 = async () => {
      setLoading(true)
      setError(null)

      try {
        console.log('🔍 Récupération des données TAB1...')

        const response = await axios.get('/api/v1/business/tab1-data')

        console.log('📦 Réponse TAB1 reçue:', response.data)

        let guideData = null

        // Cas 1 : API → { guide: [ { title, image, sections } ] }
        if (response.data?.guide?.[0]) {
          guideData = response.data.guide[0]
        }

        // Cas 2 : API → { title, image, sections }
        else if (response.data?.sections) {
          guideData = response.data
        }

        // Cas 3 : API → tableau de sections directement
        else if (Array.isArray(response.data)) {
          guideData = {
            title: null,
            image: null,
            sections: response.data,
          }
        }

        // Cas 4 : checklist
        else if (response.data?.checklist?.[0]) {
          const checklistItem = response.data.checklist[0]

          guideData = {
            ...checklistItem,
            sections: checklistItem.sections || [],
          }
        }

        console.log('✅ GUIDE TAB1:', guideData)
        console.log('📝 TITRE:', guideData?.title)
        console.log('🖼️ IMAGE:', guideData?.image)
        console.log('📚 SECTIONS:', guideData?.sections)

        setTab1Data(guideData)
      } catch (err) {
        console.error('❌ Erreur récupération TAB1:', err)
        setError(
          err.response?.data?.message ||
            err.message ||
            'Erreur lors du chargement des données',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTab1()
  }, [user, location.pathname])

  // Chargement TAB2
  useEffect(() => {
    if (!user || !location.pathname.startsWith('/businessapp')) return
    const fetchTab2 = async () => {
      setLoading(true)
      setError(null)

      try {
        console.log('🔍 Récupération des données TAB2...')
        const response = await axios.get('/api/v1/business/tab2-data')
        console.log('📦 Données TAB2 reçues:', response.data)
        let data = []
        if (Array.isArray(response.data)) {
          // API renvoie directement le tableau
          data = response.data
        } else if (Array.isArray(response.data?.data)) {
          data = response.data.data
        } else if (response.data?.data) {
          data = [response.data.data]
        } else if (Array.isArray(response.data?.checklist)) {
          data = response.data.checklist
        } else if (response.data?.checklist) {
          data = [response.data.checklist]
        } else if (
          typeof response.data === 'object' &&
          response.data !== null
        ) {
          data = [response.data]
        }

        console.log('✅ Données TAB2 extraites:', data)
        console.log('📊 Nombre de sections TAB2:', data.length)

        setTab2Data(data)
      } catch (err) {
        console.error('❌ Erreur TAB2:', err)

        if (err.message?.includes('Failed to fetch')) {
          setError('Le serveur est indisponible.')
        } else {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTab2()
  }, [user, location.pathname])

  // Chargement TAB3 (douane)
  useEffect(() => {
    if (!user || !location.pathname.startsWith('/businessapp')) return

    const fetchTab3 = async () => {
      setLoading(true)
      setError(null)

      try {
        console.log('🔍 Récupération des données TAB3...')
        const response = await axios.get('/api/v1/business/customs-data')
        console.log('📦 Données TAB3 reçues:', response.data)

        let data = null

        // API TAB3 → objet guide directement
        if (
          response.data &&
          typeof response.data === 'object' &&
          !Array.isArray(response.data) &&
          Array.isArray(response.data.sections)
        ) {
          data = response.data
        }

        // Si jamais l'API renvoie un tableau
        else if (Array.isArray(response.data)) {
          data = response.data
        }

        // Fallback
        else if (response.data?.data) {
          data = response.data.data
        }

        console.log('✅ Données TAB3 extraites:', data)
        console.log('📝 Titre TAB3:', data?.title)
        console.log('🖼️ Image TAB3:', data?.image)
        console.log('📚 Sections TAB3:', data?.sections)

        setTab3Data(data)
      } catch (err) {
        console.error('❌ Erreur TAB3:', err)

        if (err.message?.includes('Failed to fetch')) {
          setError('Le serveur est indisponible.')
        } else {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTab3()
  }, [user, location.pathname])

  // Chargement TAB4 (catalogue)
  useEffect(() => {
    if (!user || !location.pathname.startsWith('/businessapp')) return

    let isMounted = true

    const fetchCatalog = async () => {
      setLoading(true)
      setError(null)

      try {
        console.log('🔍 Récupération du catalogue produits...')
        const response = await axios.get('/api/v1/business/business-app-data')
        console.log('📦 Réponse catalogue reçue:', response.data)

        // ✅ Extraction des produits avec plusieurs fallbacks
        let products = []
        if (response.data?.cards) {
          products = response.data.cards
        } else if (Array.isArray(response.data)) {
          products = response.data
        } else if (response.data?.data?.cards) {
          products = response.data.data.cards
        } else if (response.data?.products) {
          products = response.data.products
        }

        console.log(`📦 ${products.length} produits trouvés`)

        // ✅ Groupement des produits par catégorie et menu
        const grouped = {}
        products.forEach((product) => {
          // Vérifier que le produit a bien un nom
          if (!product.name) {
            console.warn('⚠️ Produit sans nom:', product)
            return
          }

          const cat = product.categorie || 'Autres'
          if (!grouped[cat]) grouped[cat] = {}

          const menu = product.menu || '_no_menu_'
          if (!grouped[cat][menu]) grouped[cat][menu] = []

          grouped[cat][menu].push(product)
        })

        console.log('✅ Catalogue groupé:', Object.keys(grouped))
        if (!isMounted) return
        setTab4Data(grouped)
      } catch (err) {
        if (!isMounted) return
        console.error('❌ Erreur catalogue:', err)

        if (
          err.message.includes('Failed to fetch') ||
          err.message.includes('ERR_CONNECTION_REFUSED')
        ) {
          setError("Le serveur est indisponible. Vérifie qu'il est démarré.")
        } else if (err.response?.status === 404) {
          setError("La route /api/v1/business/business-app-data n'existe pas.")
        } else if (err.response?.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.')
        } else {
          setError(
            err.response?.data?.msg || err.message || 'Une erreur est survenue',
          )
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCatalog()

    return () => {
      isMounted = false
    }
  }, [user, location.pathname])

  // Chargement TAB6 (guide utilisateur)
  useEffect(() => {
    if (!user || !location.pathname.startsWith('/businessapp')) return

    let isMounted = true

    const fetchTab6 = async () => {
      setLoading(true)
      setError(null)

      try {
        console.log('🔍 Récupération du guide utilisateur...')
        // ✅ Correction de l'URL - enlever /avd-simulator
        const response = await axios.get('/api/v1/business/user-guide')
        console.log('📦 Réponse guide utilisateur reçue:', response.data)

        // ✅ Extraction des données avec plusieurs fallbacks
        let data = []
        if (Array.isArray(response.data)) {
          data = response.data
        } else if (response.data?.data) {
          data = Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data]
        } else if (response.data?.guide) {
          data = Array.isArray(response.data.guide)
            ? response.data.guide
            : [response.data.guide]
        } else if (response.data?.sections) {
          data = response.data.sections
        } else if (
          typeof response.data === 'object' &&
          response.data !== null
        ) {
          // Si c'est un objet unique, on le met dans un tableau
          data = [response.data]
        }

        console.log('✅ Données guide extraites:', data)
        if (!isMounted) return
        setTab6Data(data)
      } catch (err) {
        if (!isMounted) return
        console.error('❌ Erreur guide utilisateur:', err)

        if (
          err.message.includes('Failed to fetch') ||
          err.message.includes('ERR_CONNECTION_REFUSED')
        ) {
          setError("Le serveur est indisponible. Vérifie qu'il est démarré.")
        } else if (err.response?.status === 404) {
          setError(
            "La route /api/v1/business/user-guide n'existe pas sur le serveur.",
          )
        } else if (err.response?.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.')
        } else {
          setError(
            err.response?.data?.msg || err.message || 'Une erreur est survenue',
          )
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchTab6()

    return () => {
      isMounted = false
    }
  }, [user, location.pathname])

  // Chargement transactions
  // Chargement transactions
  useEffect(() => {
    if (!user) return

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `/api/v1/payment/users/${user.userId}/transactions`,
        )
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.transactions || []
        setTransactions(data)
      } catch (err) {
        console.error('❌ Erreur transactions:', err)
        if (err.response?.status === 401) {
          toast.error('Session expirée, veuillez vous reconnecter.')
        } else if (err.response?.status === 404) {
          toast.info('Aucune transaction trouvée.')
        } else {
          toast.error('Erreur lors du chargement des transactions.')
        }
      }
    }
    fetchTransactions()
  }, [user])

  // Chargement jetons
  // Chargement jetons
  useEffect(() => {
    if (!user) return

    const fetchTokens = async () => {
      try {
        const response = await axios.get(
          `/api/v1/payment/users/${user.userId}/tokens`,
        )

        let tokenData = []
        if (response.data?.jetons) {
          tokenData = Array.isArray(response.data.jetons)
            ? response.data.jetons
            : [response.data.jetons]
        } else if (Array.isArray(response.data)) {
          tokenData = response.data
        }

        setTokens(tokenData.filter(Boolean))
      } catch (err) {
        console.error('❌ Erreur jetons:', err)
        if (err.response?.status === 401) {
          toast.error('Session expirée, veuillez vous reconnecter.')
        } else if (err.response?.status === 404) {
          toast.info('Aucun jeton trouvé.')
        } else {
          toast.error('Erreur lors du chargement des jetons.')
        }
      }
    }
    fetchTokens()
  }, [user])

  const closeSidebar = () => setSidebarOpen(false)
  const isTab7 = activeNav === 'TAB7' || activeNav?.startsWith('TAB7-')

  const closeImage = () => {
    setSelectedImage(null)
    setSelectedImageCaption('')
  }

  const renderTabContent = () => {
    switch (activeNav) {
      case 'TAB1':
        return <GuideRenderer data={tab1Data} error={error} />
      case 'TAB2':
        return <GuideRenderer data={tab2Data} error={error} />
      case 'TAB3':
        return <GuideRenderer data={tab3Data} error={error} />
      case 'TAB4':
        return <ProductCatalog data={tab4Data} error={error} />
      case 'TAB5':
        return <ContactForm />
      case 'TAB6':
        return (
          <>
            <GuideRenderer data={tab6Data} error={error} />
            <CGUModal
              accepted={cguAccepted}
              setAccepted={setCguAccepted}
              onSubmit={() => {
                setShowCGUModal(false)
                setShowPaymentModal(true)
              }}
            />
          </>
        )
      case 'TAB7':
      case 'TAB7-TRANSACTIONS':
      case 'TAB7-JETONS':
      case 'TAB7-METHODES':
        if (!user) return <p>Chargement des informations utilisateur…</p>
        return (
          <div className={styles.tableWrapper}>
            <h2 className={styles.sectionTitle}>
              {activeNav === 'TAB7-TRANSACTIONS' && 'Transactions'}
              {activeNav === 'TAB7-JETONS' && 'Jetons'}
              {activeNav === 'TAB7-METHODES' && 'Mes reçus'}
              {activeNav === 'TAB7' && 'Mes paiements'}
            </h2>

            {activeNav === 'TAB7-TRANSACTIONS' && (
              <div className={styles.transactionsCard}>
                <div className={styles.tableHeader}>
                  <div>
                    <h2>Transactions</h2>
                    <p>Historique des transactions</p>
                  </div>

                  <div className={styles.transactionCount}>
                    {transactions.filter(Boolean).length} transaction
                    {transactions.filter(Boolean).length > 1 ? 's' : ''}
                  </div>
                </div>

                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Transaction ID</th>
                        <th>Montant</th>
                        <th>Statut</th>
                        <th>Méthode</th>
                        <th>Pays</th>
                        <th>Tél.</th>
                        <th>Canal</th>
                        <th>Email</th>
                        <th>IP</th>
                        <th>Région</th>
                      </tr>
                    </thead>

                    <tbody>
                      {transactions.filter(Boolean).map((tx, index) => (
                        <tr
                          key={tx.transactionId || index}
                          className={styles.userDashboardRow}
                        >
                          <UserDashboard tx={tx} />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeNav === 'TAB7-JETONS' && (
              <div className={styles.tokensCard}>
                <div className={styles.tableHeader}>
                  <div>
                    <h2>Gestion des jetons</h2>
                    <p>Suivi de votre consommation de jetons</p>
                  </div>

                  <div className={styles.tokenCount}>
                    {Array.isArray(tokens) ? tokens.length : 0} période
                    {Array.isArray(tokens) && tokens.length > 1 ? 's' : ''}
                  </div>
                </div>

                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Jetons total</th>
                        <th>Jetons restants</th>
                        <th>Nombre d'impressions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {Array.isArray(tokens) &&
                        tokens.map((token, index) => (
                          <tr
                            key={token._id || token.createdAt || index}
                            className={styles.tokenRow}
                          >
                            <TokenDashboard tx={token} />
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeNav === 'TAB7-METHODES' && (
              <div>Reçu en cours d'implémentation...</div>
            )}
          </div>
        )
      default:
        return <div>Section en cours de construction</div>
    }
  }

  if (loading && !tab1Data.length && !tab2Data.length) {
    return <div className={styles.loading}>Chargement...</div>
  }

  return (
    <div className={styles.BusinessAppLayout}>
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayActive : ''}`}
        onClick={closeSidebar}
      />
      <div className={styles.layoutWrapper}>
        <Sidebar
          className={styles.sidebar}
          activeNav={activeNav} // C'est l'élément actuellement sélectionné dans le menu -> exple: const [activeNav, setActiveNav] = useState('home')
          setActiveNav={setActiveNav} // C'est la fonction qui permet à Sidebar de changer l'élément actif. Par exemple, si l'utilisateur clique sur Voyage,
          sidebarOpen={sidebarOpen} // Cette prop indique si le Sidebar est ouvert ou fermé, principalement sur mobile.
          onClose={closeSidebar}
        />
        {/* Colonne droite */}
        <main className={styles.mainContent}>{renderTabContent()}</main>
      </div>

      {/* Modales de paiement */}
      {showPaymentModal && (
        <PaymentModal onClose={() => setShowPaymentModal(false)}>
          <div className={styles.paymentMethods}>
            <button
              className={styles.paymentBtn}
              onClick={() => {
                setShowPaymentModal(false)
                setShowMobileMoneyMtn(true)
              }}
            >
              Mobile money Fedapay
            </button>
            <button
              className={styles.paymentBtn}
              onClick={() => {
                setShowPaymentModal(false)
                setShowMobileMoneyFedapay(true)
              }}
            >
              Mobile money MTN MOMO
            </button>
            <button
              className={styles.paymentBtn}
              onClick={() => {
                setShowPaymentModal(false)
                setShowCreditCard(true)
              }}
            >
              Carte de credit
            </button>
          </div>
        </PaymentModal>
      )}
      {/* MTN Momo */}
      {showMomoModal && (
        <MobileMoneyMtn
          onClose={() => setShowMobileMoneyMtn(false)}
          onDataReceived={(data) => {
            setPaymentData(data)
            setShowMobileMoneyMtn(false)
            // Polling du statut
            const interval = setInterval(async () => {
              try {
                const response = await axios.get(
                  `/api/v1/payment/collection/transaction/status/${data.referenceId}`,
                )
                const status = response.data.status
                if (status === 'SUCCESSFUL') {
                  clearInterval(interval)
                  toast.success('Paiement réussi !')
                  const pdfResponse = await axios.get(
                    `/api/v1/payment/collection/transaction/status/pdf/${data.referenceId}`,
                    {
                      responseType: 'blob',
                    },
                  )
                  setReceiptData({
                    pdfBlob: pdfResponse.data,
                    referenceId: data.referenceId,
                    user: user,
                  })
                  setShowReceiptModal(true)
                  //Ajout d'un timer de 5 secondes
                  setTimeout(() => {
                    navigate('/avd-simulator')
                  }, 5000)
                } else if (status === 'FAILED') {
                  clearInterval(interval)
                  toast.error('Le paiement a échoué.')
                }
              } catch (err) {
                console.error('Erreur polling:', err)
              }
            }, 3000)
          }}
        />
      )}
      {/* MTN Fedapay */}
      {showCardModal && (
        <MobileMoneyFedapay
          onClose={() => setShowMobileMoneyMtn(false)}
          onDataReceived={(data) => {
            if (data.paymentUrl) {
              window.location.href = data.paymentUrl
            }
            setShowMobileMoneyMtn(false)
            //const interval = setInterval(async () => {}, 3000)
          }}
        />
      )}

      {/* Credit card */}
      {showCreditCardModal && (
        <CreditCard
          onClose={() => setShowCreditCard(false)}
          onDataReceived={(data) => {
            if (data.paymentUrl) {
              window.location.href = data.paymentUrl
            }
            setShowCreditCard(false)
            //const interval = setInterval(async () => {}, 3000)
          }}
        />
      )}

      {showReceiptModal && receiptData && (
        <ReceiptForm
          data={receiptData}
          onClose={() => setShowReceiptModal(false)}
          onDataReceived={() => {}}
        />
      )}

      {/* Lightbox image */}
      {selectedImage && (
        <div className={styles.imageOverlay} onClick={closeImage}>
          <div className={styles.imageOverlayContent}>
            <img src={selectedImage} alt={selectedImageCaption} />
            {selectedImageCaption && (
              <div className={styles.imageCaption}>{selectedImageCaption}</div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}

export default BusinessApp
