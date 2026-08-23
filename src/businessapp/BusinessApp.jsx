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

        // ✅ Extraction correcte des données
        let sections = []

        // Cas 1: response.data.guide[0].sections
        if (response.data?.guide?.[0]?.sections) {
          sections = response.data.guide[0].sections
        }
        // Cas 2: response.data.sections
        else if (response.data?.sections) {
          sections = response.data.sections
        }
        // Cas 3: response.data.checklist?.[0]
        else if (response.data?.checklist?.[0]) {
          const checklistItem = response.data.checklist[0]
          sections = checklistItem.sections || []
        }
        // Cas 4: Array.isArray(response.data)
        else if (Array.isArray(response.data)) {
          sections = response.data
        }

        console.log('✅ Données TAB1 extraites (sections):', sections)
        setTab1Data(sections)
      } catch (err) {
        console.error('❌ Erreur TAB1:', err)

        if (
          err.message.includes('Failed to fetch') ||
          err.message.includes('ERR_CONNECTION_REFUSED')
        ) {
          setError("Le serveur est indisponible. Vérifie qu'il est démarré.")
        } else {
          setError(err.message)
        }
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
      try {
        const response = await axios.get('/api/v1/business/tab2-data')
        console.log('📦 Données TAB2 reçues:', response.data)

        // ✅ Vérification et extraction des données
        let data = []
        if (Array.isArray(response.data)) {
          data = response.data
        } else if (response.data?.data) {
          data = Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data]
        } else if (response.data?.checklist) {
          data = Array.isArray(response.data.checklist)
            ? response.data.checklist
            : [response.data.checklist]
        } else if (
          typeof response.data === 'object' &&
          response.data !== null
        ) {
          // Si c'est un objet unique, on le met dans un tableau
          data = [response.data]
        }

        console.log('✅ Données TAB2 extraites:', data)
        setTab2Data(data)
      } catch (err) {
        console.error('❌ Erreur TAB2:', err)
        if (err.message.includes('Failed to fetch')) {
          setError('Le serveur est indisponible.')
        } else {
          setError(err.message)
        }
      }
    }
    fetchTab2()
  }, [user, location.pathname])

  // Chargement TAB3 (douane)
  useEffect(() => {
    if (!user || !location.pathname.startsWith('/businessapp')) return

    const fetchTab3 = async () => {
      try {
        const response = await axios.get('/api/v1/business/customs-data')
        console.log('📦 Données TAB3 reçues:', response.data)

        // ✅ Vérification et extraction des données
        let data = []
        if (Array.isArray(response.data)) {
          data = response.data
        } else if (response.data?.data) {
          data = Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data]
        } else if (response.data?.sections) {
          data = Array.isArray(response.data.sections)
            ? response.data.sections
            : [response.data.sections]
        } else if (
          typeof response.data === 'object' &&
          response.data !== null
        ) {
          // Si c'est un objet unique, on le met dans un tableau
          data = [response.data]
        }

        console.log('✅ Données TAB3 extraites:', data)
        setTab3Data(data)
      } catch (err) {
        console.error('❌ Erreur TAB3:', err)
        if (err.message.includes('Failed to fetch')) {
          setError('Le serveur est indisponible.')
        } else {
          setError(err.message)
        }
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

  const handleImageClick = (imageUrl, caption) => {
    const url =
      imageUrl?.startsWith('http') ||
      imageUrl?.startsWith('/assets') ||
      imageUrl?.startsWith('/public')
        ? imageUrl
        : `http://localhost:5000${imageUrl}`
    setSelectedImage(url)
    setSelectedImageCaption(caption || 'Image')
  }

  const closeImage = () => {
    setSelectedImage(null)
    setSelectedImageCaption('')
  }

  const renderTabContent = () => {
    switch (activeNav) {
      case 'TAB1':
        return (
          <GuideRenderer
            data={tab1Data}
            error={error}
            onImageClick={handleImageClick}
          />
        )
      case 'TAB2':
        return (
          <GuideRenderer
            data={tab2Data}
            error={error}
            onImageClick={handleImageClick}
          />
        )
      case 'TAB3':
        return (
          <GuideRenderer
            data={tab3Data}
            error={error}
            onImageClick={handleImageClick}
          />
        )
      case 'TAB4':
        return (
          <ProductCatalog
            data={tab4Data}
            error={error}
            onImageClick={handleImageClick}
          />
        )
      case 'TAB5':
        return <ContactForm />
      case 'TAB6':
        return (
          <>
            <GuideRenderer
              data={tab6Data}
              error={error}
              onImageClick={handleImageClick}
            />
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
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Transaction ID</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Méthode</th>
                    <th>Pays</th>
                    <th>Tél</th>
                    <th>Canal</th>
                    <th>Email</th>
                    <th>IP</th>
                    <th>Région</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.filter(Boolean).map((tx, index) => (
                    <tr key={index} className={styles.userDashboardRow}>
                      <UserDashboard tx={tx} />
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeNav === 'TAB7-JETONS' && (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Jetons total</th>
                    <th>Jetons restant</th>
                    <th>Nombre d'impressions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(tokens) &&
                    tokens.map((token, index) => (
                      <TokenDashboard key={index} tx={token} />
                    ))}
                </tbody>
              </table>
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
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          sidebarOpen={sidebarOpen}
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
