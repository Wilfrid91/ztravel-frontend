import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MENU_ITEMS_DDAY } from '../../data/BusinessAppPage.js'
import { useGlobalContext } from '../../context.js'
import { useNavigate, useLocation } from 'react-router-dom'
import GuideRenderer from '../../utils/GuideRenderer.jsx'
import RichRenderer from '../../utils/RichRenderer.jsx'
import MtnPaymentForm from '../../utils/MtnForm.jsx'
import MtnModal from '../../utils/MtnModal.jsx'
import FedaPayModal from '../../utils/FedaPayModal.jsx'
import FedaPayForm from '../../utils/FedaPayForm.jsx'
import CGUReact from '../../utils/CGUReact.jsx'
import ReceiptForm from '../../utils/ReceiptForm.jsx'
import { toast } from 'react-toastify'
import styles from '../../css/avd.module.css'
import stylesBussinessApp from '../../css/BusinessappMain.module.css'
import { ProductCatalog } from '../../pages/ProductCatalog.jsx'
import stylesCatalog from '../../css/catalog.module.css'
import ContactForm from '../../pages/ContactForm.jsx'
import UserDashboard from './UserDashboard.jsx'
import JetonDashboard from './JetonDashboard.jsx'
import GuideRendererV1 from '../../utils/GuideRenderer-v1.jsx'
import GuideRendererTab3 from '../../utils/GuideRendererTab3.jsx'
import { FaUserCircle } from 'react-icons/fa'
import Header from '../../components/Header/Header.jsx'

const BusinessAppMain = ({ activeNav, setActiveNav }) => {
  const activeMenu = MENU_ITEMS_DDAY.find((item) => item.id === activeNav)

  const API_BASE_URL = process.env.REACT_APP_API_URL
  const { user } = useGlobalContext() // récupérer le usename
  const { removeUser } = useGlobalContext() // récupérer le usename
  const navigate = useNavigate()
  const location = useLocation()

  const [loading, setLoading] = useState(true)
  const [tab1Data, setTab1Data] = useState([])
  const [tab2Data, setTab2Data] = useState([])
  const [tab3Data, setTab3Data] = useState([])
  const [tab4Data, setTab4Data] = useState([])
  const [tab6Data, setTab6Data] = useState([])
  const [tab7Data, setTab7Data] = useState([])
  const [tab7Jetons, settab7Jetons] = useState([])

  const [cgu, setCGU] = useState([])
  const [accepted, setAccepted] = useState(false)
  const [htmlContactForm, setHtml] = useState('') // Handle contact page from server side
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  // Ajouter les états de recherche & filtres
  const [search, setSearch] = useState('')
  const [filterCategorie, setFilterCategorie] = useState('all')
  const [filterMenu, setFilterMenu] = useState('all')
  const [showMenu, setShowMenu] = useState(false) // Handle user disconnection icon
  const [showMtnModal, setShowMtnModal] = useState(false)
  const [showFedapayModal, setShowFedapayModal] = useState(false)
  const [showTenderTypeModal, setshowTenderTypeModal] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [requestToPayTransaction, setRequestToPayTransaction] = useState(null)
  const [fedapayTransaction, setShowFedapayTransaction] = useState(null)
  const [message, setMessage] = useState('')
  const [showPdfButtons, setShowPdfButtons] = useState(false)
  const [showCguModal, setShowCguModal] = useState(false)
  const [alreadyAccepted, setAlreadyAccepted] = useState(false) // check if J'accept is already consented
  const [mtnPaymentReceiptData, setShowmtnPaymentReceiptData] = useState(false) //

  // État pour les transactions, le chargement et les filtres
  const [transactions, setTransactions] = useState([])
  const [startDate, setStartDate] = useState('') // Date de début
  const [endDate, setEndDate] = useState('') // Date de fin
  const [filterType, setFilterType] = useState('Tous') // Filtre par type

  // children handler
  const [openMenus, setOpenMenus] = useState({})
  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Vérifie si activeNav est un sous-menu de TAB7
  const isTab7Active = activeNav === 'TAB7' || activeNav?.startsWith('TAB7-')
  const activeTab6Child = activeNav // Utilise directement activeNav (qui contient déjà "TAB7-TRANSACTIONS")

  //Handle the products catalog
  function buildCatalog(catalogProducts) {
    const result = {}
    if (!Array.isArray(catalogProducts)) {
      console.error("❌ products n'est pas un tableau:", catalogProducts)
      return {} // Retourne un objet vide par sécurité
    }
    catalogProducts.forEach((p) => {
      if (!result[p.categorie]) {
        result[p.categorie] = {}
      }

      if (p.menu) {
        if (!result[p.categorie][p.menu]) {
          result[p.categorie][p.menu] = []
        }
        result[p.categorie][p.menu].push(p)
      } else {
        if (!result[p.categorie].items) {
          result[p.categorie].items = []
        }
        result[p.categorie].items.push(p)
      }
    })
    return result
  }

  const getFilteredCatalog = () => {
    // tab4Data est un objet groupé : { "Maison": { "Salle de bain": [...] } }
    if (typeof tab4Data !== 'object' || tab4Data === null) return []

    // 1. Transformer en tableau plat
    let flatProducts = []
    Object.entries(tab4Data).forEach(([categorie, menus]) => {
      Object.entries(menus).forEach(([menu, produits]) => {
        if (Array.isArray(produits)) {
          produits.forEach((prod) => {
            flatProducts.push({
              ...prod,
              categorie: categorie,
              menu: menu === '_no_menu_' ? null : menu,
            })
          })
        }
      })
    })

    // 2. Appliquer les filtres sur ce tableau
    let filtered = [...flatProducts]

    if (filterCategorie !== 'all') {
      filtered = filtered.filter((p) => p.categorie === filterCategorie)
    }

    if (filterCategorie !== 'all' && filterMenu !== 'all') {
      filtered = filtered.filter((p) => p.menu === filterMenu)
    }

    if (search.trim() !== '') {
      const term = search.toLowerCase()
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(term))
    }

    return filtered
  }

  const parseTitleWithLink = (title) => {
    if (!title) return '' // Gestion du cas où title est undefined
    const parts = title.split('|^')
    const text = parts[0]
    const url = parts[1]

    if (url) {
      return (
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          {text}
        </a>
      )
    }
    return text
  }

  useEffect(() => {
    // Si l'utilisateur A est déconnecté, on ne charge aucune page!!
    if (!user) return
    // 2) Pas sur une page business → pas d’appel
    const isBusinessPage = location.pathname.startsWith('/businessapp')
    if (!isBusinessPage) return

    const getTab1DataFromNodeServer = async () => {
      try {
        /**
        {
            "checklist": [
              {
                "title": "Guide pour voyager en Chine",
                "sections": [ ... ]
              }
            ]
          }
         */
        const response = await axios.get('/api/v1/business/tab1-data')
        // On récupère le premier guide
        const guide = response.data?.checklist?.[0]
        setTab1Data(guide)
      } catch (error) {
        // Détection serveur éteint
        if (
          error.message.includes('Failed to fetch') ||
          error.message.includes('ERR_CONNECTION_REFUSED')
        ) {
          setError("Le serveur est indisponible. Vérifie qu'il est démarré.")
          return
        }
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    getTab1DataFromNodeServer()
  }, [user, location.pathname])

  // Fetch the Data about the D Day from nodejs
  useEffect(() => {
    // Si l'utilisateur A est déconnecté, on ne charge aucune page!!
    if (!user) return
    // 2) Pas sur une page business → pas d’appel
    const isBusinessPage = location.pathname.startsWith('/businessapp')
    if (!isBusinessPage) return

    console.log('Je fetch les données de D Day')
    const getTab2DataFromNodeServer = async () => {
      try {
        const response = await axios.get('/api/v1/business/tab2-data')
        //console.log('✅ Réponse backend T2:', response)
        //console.log('📦 Données reçues:', response.data)

        // Vérifie si data est un tableau ou un objet
        let data = []
        if (Array.isArray(response.data)) data = response.data
        else if (response.data?.data) data = response.data.data

        setTab2Data(data)
      } catch (error) {
        // Détection serveur éteint
        if (
          error.message.includes('Failed to fetch') ||
          error.message.includes('ERR_CONNECTION_REFUSED')
        ) {
          setError("Le serveur est indisponible. Vérifie qu'il est démarré.")
          return
        }
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    getTab2DataFromNodeServer()
  }, [user, location.pathname])

  /**
   * Handle the contact form
   */
  useEffect(() => {
    // Si l'utilisateur A est déconnecté, on ne charge aucune page!!
    if (!user) return
    const MAX_SIZE = 2 * 1024 * 1024

    if (!htmlContactForm) return

    let isSubmitting = false

    const form = document.querySelector('#contact-form')
    if (!form) return

    const handleSubmit = async (e) => {
      e.preventDefault()
      if (isSubmitting) return
      isSubmitting = true

      const submitBtn = form.querySelector('.contact-submit')
      const originalText = submitBtn.textContent

      submitBtn.disabled = true
      submitBtn.textContent = 'Envoi en cours...'

      try {
        const data = new FormData()
        data.append('name', form.name.value.trim())
        data.append('email', form.email.value.trim())
        data.append('phone', form.phone.value.trim())
        data.append('message', form.message.value.trim())
        data.append('captcha', form.captcha.value.trim())
        data.append(
          'captchaToken',
          document.querySelector('#captchaToken').value,
        )

        const file = form.productPhoto.files[0]
        if (file) {
          if (file.size > MAX_SIZE) {
            throw new Error("L'image dépasse 2 MO")
          }
          data.append('productPhoto', file)
        }

        const response = await axios.post('/api/v1/business/post-form', data, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        toast.success(response.data.msg)
        form.reset()
      } catch (error) {
        toast.error(
          `❌ Erreur : ${error.response?.data?.error || 'Erreur inconnue'}`,
        )
      } finally {
        isSubmitting = false
        submitBtn.disabled = false
        submitBtn.textContent = originalText
      }
    }

    form.addEventListener('submit', handleSubmit)

    return () => {
      form.removeEventListener('submit', handleSubmit)
    }
  }, [htmlContactForm])

  useEffect(() => {
    console.log('🔄 Préparation du catalogue...')
    // 1) Si l'utilisateur A est déconnecté, on ne charge aucune page!!
    if (!user) return

    // 2) Pas sur une page business → pas d’appel
    const isBusinessPage = location.pathname.startsWith('/businessapp')
    if (!isBusinessPage) return

    const getProductCatalogFromNodeServer = async () => {
      try {
        const response = await axios.get('/api/v1/business/business-app-data')
        console.log('Réponse backend T4 :', response)
        console.log('📦 Données reçues:', response.data)
        // On transforme le tableau en structure hiérarchique
        const structured = buildCatalog(response.data.cards)
        console.log('📦 Données reçues:', structured)

        setTab4Data(structured)
      } catch (error) {
        // Détection serveur éteint
        if (
          error.message.includes('Failed to fetch') ||
          error.message.includes('ERR_CONNECTION_REFUSED')
        ) {
          setError("Le serveur est indisponible. Vérifie qu'il est démarré.")
          return
        }
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    getProductCatalogFromNodeServer()
  }, [user, location.pathname, activeMenu])

  useEffect(() => {
    console.log('🔄 Récupération donnée douane...')
    // Si l'utilisateur A est déconnecté, on ne charge aucune page!!
    if (!user) return
    // 2) Pas sur une page business → pas d’appel
    const isBusinessPage = location.pathname.startsWith('/businessapp')
    if (!isBusinessPage) return

    const getTab3DataFromNodeServer = async () => {
      try {
        const response = await axios.get('/api/v1/business/customs-data')
        console.log(response.data)
        // Le backend renvoie un OBJET
        setTab3Data(response.data)
      } catch (error) {
        // Détection serveur éteint
        if (
          error.message.includes('Failed to fetch') ||
          error.message.includes('ERR_CONNECTION_REFUSED')
        ) {
          setError("Le serveur est indisponible. Vérifie qu'il est démarré.")
          return
        }
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    getTab3DataFromNodeServer()
  }, [user, location.pathname])

  /**
   * Recpère le statut du paiement et imprime le tiket PDF -> requestToPayTransactionStatus
   */
  useEffect(() => {
    if (!requestToPayTransaction?.referenceId) return

    const referenceId = requestToPayTransaction.referenceId
    let intervalId = null

    const getStatus = async () => {
      try {
        // 1) GET JSON STATUS
        const response = await axios.get(
          `/api/v1/payment/collection/transaction/status/${referenceId}`,
        )

        const status = response.data.status
        console.log('STATUT MOMO :', status)

        if (status === 'PENDING') {
          setMessage('Paiement en cours…')
        }

        if (status === 'FAILED') {
          setMessage('Le paiement a échoué. Veuillez réessayer.')
          clearInterval(intervalId)
        }

        if (status === 'SUCCESSFUL') {
          clearInterval(intervalId)

          const pdfResponse = await axios.get(
            `/api/v1/payment/collection/transaction/status/pdf/${referenceId}`,
            { responseType: 'blob' },
          )

          const blob = pdfResponse.data

          if (blob.type !== 'application/pdf') {
            console.warn('Type inattendu:', blob.type)
          }

          setShowmtnPaymentReceiptData({
            pdfBlob: blob,
            referenceId,
            user,
          })

          // 2) Afficher les boutons
          setShowPdfButtons(true)

          // 3) Ne pas rediriger tout de suite
          toast.success('Paiement réussi — choisissez une action')

          // reinitialiser le compteur d'impression à 0 Dans le backend, au moment où tu confirmes que le paiement correspond bien à un “paiement pour impressions”.
        }
      } catch (error) {
        console.error('Erreur polling :', error)
      }
    }

    intervalId = setInterval(getStatus, 3000)
    getStatus()

    return () => clearInterval(intervalId)
  }, [requestToPayTransaction])

  /**
   * Avant paiement MTN MOMO : vérifier si l’utilisateur a déjà un abonnement actif
   * */
  useEffect(() => {
    if (!user) return
    const checkSubscription = async () => {
      const res = await axios.get(
        '/api/v1/payment/collection/subscription/status',
      )
      if (res.data.status === 'ACTIVE') {
        navigate('/avd-simulator')
        return
      }

      if (res.data.status === 'EXPIRED') {
        setMessage('Votre abonnement a expiré')
        return
      }
      // status === NONE → afficher bouton "Payer"
    }
    checkSubscription()
  }, [])

  /**
   * Get Simulator user guige
   */
  useEffect(() => {
    console.log('TAB6 DATA')
    if (!user) return

    const getUserGuideData = async () => {
      try {
        const response = await axios.get(`/api/v1/business/user-guide`)

        console.log('Données reçues:', response.data)
        // Empêche un crash si ce n’est pas un array
        // Elle va contenir toujours un tableau, quoi qu’il arrive.
        if (Array.isArray(response.data)) {
          setTab6Data(response.data)
        } else {
          setTab6Data([])
        }
      } catch (error) {
        console.error(error)
      }
    }
    getUserGuideData()
  }, [user])

  /**
   * Get user dashboard
   */
  useEffect(() => {
    // Si l'utilisateur A est déconnecté, on ne charge aucune page!!
    if (!user) return
    const userId = user.userId
    const getUserDashboardData = async () => {
      try {
        const response = await axios.get(
          `/api/v1/payment/users/${userId}/transactions`,
        )
        // Vérifie si data est un tableau ou un objet
        // Le backend renvoie { catalog: [...] }
        const data = response.data
        setTab7Data(data)
      } catch (error) {
        console.error(error)
      }
    }
    getUserDashboardData()
  }, [user])

  /**
   * Get user dashboard
   */
  useEffect(() => {
    // Si l'utilisateur A est déconnecté, on ne charge aucune page!!
    if (!user) return
    const userId = user.userId
    const getUserPrintingToken = async () => {
      try {
        const response = await axios.get(
          `/api/v1/payment/users/${userId}/tokens`,
        )
        // Vérifie si data est un tableau ou un objet
        // Le backend renvoie { catalog: [...] }
        const data = response.data

        // Vérifie si data.jetons est un objet ou un tableau
        settab7Jetons(Array.isArray(data.jetons) ? data.jetons : [data.jetons])
      } catch (error) {
        console.error(error)
      }
    }
    getUserPrintingToken()
  }, [user])

  //1. Quand il n’a jamais accepté → POST + modal
  // call in line 697
  const handleSubmitCGU = async () => {
    if (!accepted) return

    setLoading(true)
    try {
      await axios.post('/api/v1/business/submit-cgu', {
        accepted: true,
        version: '1.0',
        acceptedAt: new Date(),
      })
      console.log('Consentement enregistré')
      setShowCguModal(false)
      setshowTenderTypeModal(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  /* Get the CGU from server*/
  useEffect(() => {
    if (!user) return
    const getCGU = async () => {
      try {
        const response = await axios.get('/api/v1/business/get-cgu')
        const payload = response.data
        console.log('Réponse backend : ', payload)
        // Cas 1 : objet { cgu: "..." }
        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
          setCGU([payload])
          return
        } else {
          setError("Format inattendu : CGU form n'est pas une string")
        }
      } catch (error) {
        setError(error.message)
      }
    }
    getCGU()
  }, [])

  // 2. Quand il a déjà accepté → pas de POST, juste ouvrir le modal
  const handleSkipSubmit = () => {
    setShowCguModal(false)
    setshowTenderTypeModal(true)
  }

  useEffect(() => {
    const checkConsent = async () => {
      try {
        const res = await axios.get('/api/v1/business/check-cgu')

        if (res.data.accepted === true) {
          setShowCguModal(false)
          setAlreadyAccepted(true)
        } else {
          setShowCguModal(true)
        }
      } catch (err) {
        console.error(err)
      }
    }
    checkConsent()
  }, [])

  useEffect(() => {
    if (!alreadyAccepted) return
    // On attend que le DOM soit rendu
    setTimeout(() => {
      const radio = document.querySelector('input[name="accept_cgu"]')
      if (radio) {
        radio.checked = true
        radio.disabled = true
      }
    }, 50)
  }, [alreadyAccepted])

  {
    /*FIN des USEEFFECTS*/
  }

  /**
   * Trigger the modal based on the payment method
   * @param {} tender
   * @returns
   */
  const handlePayment = async (tender) => {
    let response
    try {
      switch (tender) {
        case 'FEDAPAY':
          setshowTenderTypeModal(false) // <-- fermer le premier modal
          setShowFedapayModal(true)
          break
        case 'mtn':
          setshowTenderTypeModal(false) // <-- fermer le premier modal
          setShowMtnModal(true)
          break

        default:
          console.error('Méthode de paiement inconnue :', tender)
          return
      }

      // Tu peux ensuite rediriger ou ouvrir une page de paiement
    } catch (error) {
      console.error('Erreur lors du paiement :', error)
    }
  }

  const handleMomoPaytDataReceived = (combinedData) => {
    setRequestToPayTransaction(combinedData)
    // Fermer le modal
    setShowMtnModal(false)
  }

  const handleFedayDataReceived = (combinedData) => {
    console.log('Données FedaPay reçues :', combinedData)
    // Exemple : stocker la transaction
    setShowFedapayTransaction(combinedData)
    // Fermer le modal
    setShowFedapayModal(false)
  }
  // User disconnection
  const handleLogout = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/logout`, { withCredentials: true })
    } catch (err) {
      console.log(err)
    }
    removeUser() // indispensable
    navigate('/login') // optionnel mais recommandé
  }

  if (loading) return <div>Chargement...</div>

  return (
    <>
      {/* HEADER */}
      <Header />
      {/* Colonne gauche */}
      <div className={styles.contentWrapper}>
        <aside className={styles.sidebar}>
          <nav className={styles.menu}>
            {MENU_ITEMS_DDAY.map(
              ({ id, title, short, icon: Icon, children }) => (
                <li
                  key={id}
                  className={activeNav === id ? styles.activeItem : ''}
                >
                  <div
                    className={styles.parentLine}
                    onClick={() => {
                      setActiveNav(id)
                      if (children) toggleMenu(id)
                    }}
                  >
                    {/* Icône */}
                    <span className={styles.iconWrapper}>
                      <Icon className={styles.icon} />
                    </span>

                    {/* Titre */}
                    <span className={styles.label}>
                      {id === 'TAB8'
                        ? parseTitleWithLink(title)
                        : short || title}
                    </span>

                    {/* Flèche */}
                    {children && (
                      <span className={styles.arrow}>
                        {openMenus[id] ? '▼' : '▶'}
                      </span>
                    )}
                  </div>

                  {/* Sous-menus */}
                  {children && openMenus[id] && (
                    <div className={styles.childrenWrapper}>
                      {children.map((child) => (
                        <a
                          key={child.id}
                          href={`#${child.id}`}
                          className={`${styles.childLine} ${
                            activeNav === child.id ? styles.activeChild : ''
                          }`}
                          onClick={() => setActiveNav(child.id)}
                        >
                          {/* Icône du sous-menu */}
                          <child.icon className={styles.childIcon} />

                          {child.title}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ),
            )}

            <div className={styles.sidebarContainer}>
              <div className={styles.sidebarUserWrapper}>
                <div
                  className={styles.sidebarUser}
                  onClick={() => setShowMenu((prev) => !prev)}
                >
                  <span className={styles.sidebarUserIcon}>
                    <FaUserCircle />
                  </span>

                  <span className={styles.username}>
                    {user ? user.prenom : 'Utilisateur'}
                  </span>
                </div>

                {showMenu && (
                  <div className='user-menu'>
                    <button onClick={handleLogout}>Déconnexion</button>
                  </div>
                )}

                {selectedImage && (
                  <div
                    className='image-overlay'
                    onClick={() => setSelectedImage(null)}
                  >
                    <div className='image-overlay-content'>
                      <img src={`API_BASE_URL${selectedImage}`} alt='Aperçu' />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </nav>
          {/* ... reste de ton code ... */}
        </aside>
        <main className={stylesBussinessApp.layoutMain}>
          {activeMenu?.id === 'TAB1' && (
            <GuideRendererV1 data={tab1Data} error={error} />
          )}
          {/*FIN TAB 1*/}
          {activeMenu?.id === 'TAB2' && (
            <div className=''>
              {console.log('TAB2 DATA =', tab2Data)}
              <GuideRenderer data={tab2Data} error={error} />
            </div>
          )}
          {/*FIN TAB 2*/}
          {activeMenu?.id === 'TAB3' && (
            <>
              <div className='guide-card'>
                {console.log('TAB3 DATA =', tab3Data)}
                <GuideRendererTab3 data={tab3Data} error={error} />
              </div>
            </>
          )}
          {showTenderTypeModal && (
            <div className={stylesBussinessApp.paymentOverlay}>
              <div className={stylesBussinessApp.paymentModal}>
                <h2>Paiement sécurisé</h2>
                <p>Veuillez selectionner votre méthode de paiement</p>

                <div className={stylesBussinessApp.paymentMethods}>
                  <button onClick={() => handlePayment('FEDAPAY')}>
                    Carte de crédit
                  </button>
                  <button onClick={() => handlePayment('mtn')}>MTN MOMO</button>
                </div>

                <button
                  className={stylesBussinessApp.closeBtn}
                  onClick={() => setshowTenderTypeModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
          {showMtnModal && (
            <MtnModal onClose={() => setShowMtnModal(false)}>
              <MtnPaymentForm
                OnDataReceived={handleMomoPaytDataReceived}
                onClose={() => setShowMtnModal(false)}
              />
            </MtnModal>
          )}
          {showFedapayModal && (
            <FedaPayModal onClose={() => setShowFedapayModal(false)}>
              <FedaPayForm
                OnDataReceived={handleFedayDataReceived}
                onClose={() => setShowFedapayModal(false)}
              />
            </FedaPayModal>
          )}
          {showPdfButtons && mtnPaymentReceiptData && (
            <FedaPayModal onClose={() => setShowFedapayModal(false)}>
              <ReceiptForm
                data={mtnPaymentReceiptData} // <-- passe la prop data.
                OnDataReceived={(data) => console.log('PDF ready:', data)} // Le composant enfant, tu dois récupérer data
                onClose={() => setShowFedapayModal(false)}
              />

              <button
                onClick={() => navigate('/avd-simulator')}
                style={{
                  marginTop: '20px',
                  padding: '12px',
                  background: '#000000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                Continuer vers le simulateur
              </button>
            </FedaPayModal>
          )}
          {/*  FIN TAB 3*/}
          {activeMenu?.id === 'TAB4' && (
            <div className={stylesCatalog.tab4Container}>
              {/* {styles.tab4Container} pour décaler les filtres vers le bas*/}
              {error && <div className='error-message'>{error}</div>}
              {console.log('TAB4 DATA =', tab4Data)}
              <div className={styles.filtersRow}>
                {/* Recherche */}
                <input
                  type='text'
                  className={styles.searchInput}
                  placeholder='Rechercher un produit...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {/* Filtre Catégorie */}
                <select
                  className={styles.filterSelect}
                  value={filterCategorie}
                  onChange={(e) => {
                    setFilterCategorie(e.target.value)
                    setFilterMenu('all')
                  }}
                >
                  <option value='all'>Toutes les catégories</option>

                  {Object.keys(tab4Data).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {/* Filtre Menu */}
                {filterCategorie !== 'all' && (
                  <select
                    className={styles.filterSelect}
                    value={filterMenu}
                    onChange={(e) => setFilterMenu(e.target.value)}
                  >
                    <option value='all'>Tous les menus</option>

                    {Object.keys(tab4Data[filterCategorie])
                      .filter((m) => m !== '_no_menu_')
                      .map((menu) => (
                        <option key={menu} value={menu}>
                          {menu}
                        </option>
                      ))}
                  </select>
                )}
              </div>
              {(() => {
                const filtered = getFilteredCatalog()
                console.log(
                  'filtered est un tableau ?',
                  Array.isArray(filtered),
                )
                console.log('Nombre de produits :', filtered.length)
                console.log('Premier produit :', filtered[0])
                return <ProductCatalog data={filtered} />
              })()}
            </div>
          )}
          {selectedImage && (
            <div
              className='image-overlay'
              onClick={() => setSelectedImage(null)}
            >
              <div className='image-overlay-content'>
                <img
                  src={`${process.env.REACT_APP_BASE_URL}${selectedImage}`}
                  alt='Aperçu'
                />
              </div>
            </div>
          )}
          {/*FIN TAB 4*/}
          {activeMenu?.id === 'TAB5' && (
            <div>
              <ContactForm />
            </div>
          )}
          {/*FIN TAB 5*/}
          {/*
          entry: {
          fedapay: {...},
          jetons: null,
          momo: Array(127)
          }*/}
          {/* Contenu pour TAB6 et ses sous-menus */}
          {activeMenu?.id === 'TAB6' && (
            <div className='guide-card'>
              <GuideRenderer data={tab6Data} error={error} />
              <CGUReact
                accepted={accepted}
                setAccepted={setAccepted}
                alreadyAccepted={alreadyAccepted}
                onSubmit={handleSubmitCGU}
                onSkipSubmit={handleSkipSubmit}
              />
            </div>
          )}
          {/* Contenu pour TAB7 et ses sous-menus */}
          {isTab7Active &&
            (!user ? (
              <p>Chargement des informations utilisateur…</p>
            ) : (
              <div className={stylesBussinessApp.tableWrapper}>
                <h2 className='text-xl font-bold mb-4'>
                  {activeNav === 'TAB7-TRANSACTIONS' && 'Transactions'}
                  {activeNav === 'TAB7-JETONS' && 'Jetons'}
                  {activeNav === 'TAB7-METHODES' && 'Mes reçus'}
                  {activeNav === 'TAB7' &&
                    'Mes paiements - Aucun paiement actuellement disponible'}
                </h2>
                {/* Contenu dynamique */}
                {activeNav === 'TAB7-TRANSACTIONS' && (
                  <table className={stylesBussinessApp.table}>
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
                      {tab7Data.filter(Boolean).map((tx, index) => (
                        <tr key={index}>
                          <UserDashboard tx={tx} />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {activeNav === 'TAB7-JETONS' && (
                  <table className={stylesBussinessApp.table}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Jetons total</th>
                        <th>Jetons restant</th>
                        <th>Nombre d'impressions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(tab7Jetons) &&
                        tab7Jetons.map((tx, index) => (
                          <tr key={index}>
                            <JetonDashboard tx={tx} />
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
                {activeNav === 'TAB7-METHODES' && (
                  <div>Reçu en cours d'implemantation...</div>
                )}
              </div>
            ))}
        </main>
      </div>
      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>© 2026 ZTravel Consulting — All rights reserved</p>
      </footer>
    </>
  )
}
export default BusinessAppMain
