import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGlobalContext } from '../../context.js'
import axios from 'axios'
import { MENU_ITEMS_AVD } from '../../data/AsideSimulator.js'
import GuideRenderer from '../../utils/GuideRenderer.jsx'
import {
  useProductHandler,
  useShippingHandler,
} from '../../utils/AVDService.js'

import {
  useListHandler,
  VehicleHandler,
  ProductHandler,
  useHandler,
  ShippingHandler,
} from '../../utils/AVDServiceClass.js'
import styles from '../../css/avd.module.css'
import { toast } from 'react-toastify'
import { FaUserCircle } from 'react-icons/fa'
import Header from '../../components/Header/Header.jsx'

export default function AVDSimulator() {
  const [showMenu, setShowMenu] = useState(false) // Handle user disconnection icon
  const [selectedImage, setSelectedImage] = useState(null)
  const { user, logoutUser } = useGlobalContext() // User clicked on disconnection button
  const navigate = useNavigate()
  const [avdSimulatorData, setAvdSimulatorData] = useState([])
  const [avdTab2Data, setAvdTab2Data] = useState([])
  const [avdTab3Data, setAvdTab3Data] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const formRefTab2 = useRef(null) // Handle the AVD form
  const formRefTab3 = useRef(null) // Handle the AVD form
  const [activeTab, setActiveTab] = useState('demarrer')
  const MAX_SIZE = 2 * 1024 * 1024 // MAX size 2 mega-octets

  /*const {
    products,
    updateProduct,
    addProduct,
    removeProduct,
    validateProducts,
    resetProducts,
  } = useProductHandler() // useProductHandler: custom hook
  // Shipping Handler
  const { shippingInfo, updateShipping, validateShipping, resetShipping } =
    useShippingHandler()*/

  /**
   * Product service calls
   *  validateProducts: en appelant useListHandler(ProductHandler)
   */
  const {
    items: products,
    update: updateProduct,
    add: addProduct,
    remove: removeProduct,
    validateList: validateProducts,
    reset: resetProducts,
  } = useListHandler(ProductHandler)

  /**
   * Vehicule service calls
   *  validateVehicles: en appelant useListHandler(VehicleHandler)
   */
  const {
    items: vehicles,
    update: updateVehicle,
    add: addVehicle,
    remove: removeVehicle,
    validateList: validateVehicles,
    reset: resetVehicle,
  } = useListHandler(VehicleHandler)

  /**
   * Shipping service calls
   *  validateVehicles: en appelant useListHandler(VehicleHandler)
   * * _: Pour identifier la classe
   */
  const {
    state: shippingInfo, // before shippingInfo_
    update: updateShipping, // before updateShipping_
    reset: resetShipping, // updateShipping_
    validate: validateShipping, // updateShipping_
  } = useHandler(ShippingHandler)

  // Protection de la page
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Ne peux pas utiliser navigate() dans le contexte, donc tu dois le faire dans le composant
  const handleLogout = async () => {
    await logoutUser()
    navigate('/login')
  }

  // récupéper les données de la page du simulateur
  // Fetch the Data from simulateurDD about the D Day from nodejs
  useEffect(() => {
    // Si l'utilisateur A est déconnecté, on ne charge aucune page!!
    if (!user) return
    // 2) Pas sur une page business → pas d’appel
    const isSimulatorPage = location.pathname.startsWith('/avd-simulator')
    if (!isSimulatorPage) return

    console.log('Je fetch les données de simulateurDD')
    const getSimulatorDataFromNodeServer = async () => {
      try {
        const response = await axios.get('/api/v1/business/simulator-page')
        setAvdSimulatorData(response.data)
      } catch (error) {
        // Détection serveur éteint
        // Cas 1 : backend renvoie un message
        if (error.response?.status === 401) {
          toast.error('Session expirée, veuillez vous authentifier')
          return
        }
        // Cas 2 : autre erreur backend
        if (error.response?.data?.msg) {
          toast.error(error.response.data.msg)
          return
        }
        // Cas 3 : erreur réseau ou inconnue
        toast.error('Une erreur est survenue, veuillez réessayer')
      }
    }
    getSimulatorDataFromNodeServer()
  }, [user, location.pathname])

  /**
   * GET TAB2 DATA
   */
  useEffect(() => {
    // 1) Si l'utilisateur A est déconnecté, on ne charge aucune page!!
    if (!user) return
    // 2) Pas sur une page business → pas d’appel
    //const isBusinessPage = location.pathname.startsWith('/businessapp')
    //if (!isBusinessPage) return

    console.log('Je réagis à la récupération des données TAB2 AVD')

    const getTab2AvdDataFromNodeServer = async () => {
      try {
        const response = await axios.get('/api/v1/business/simulator-tab2')
        // Vérifie si data est un tableau ou un objet
        let data = []
        if (Array.isArray(response.data)) data = response.data
        else if (response.data?.data) data = response.data.data

        setAvdTab2Data(data)

        console.log('Réponse backend : ', response)
      } catch (error) {
        toast.error(error.message)
      }
    }
    getTab2AvdDataFromNodeServer()
  }, [user, location.pathname])

  /**
   * GET TAB3 DATA
   */
  useEffect(() => {
    // 1) Si l'utilisateur A est déconnecté, on ne charge aucune page!!
    if (!user) return
    // 2) Pas sur une page business → pas d’appel
    //const isBusinessPage = location.pathname.startsWith('/businessapp')
    //if (!isBusinessPage) return

    console.log('Je réagis à la récupération des données TAB3 AVD')

    const getTab3UserGuideFromNodeServer = async () => {
      try {
        const response = await axios.get('/api/v1/business/simulator-tab3')
        // Vérifie si data est un tableau ou un objet
        let data = []
        if (Array.isArray(response.data)) data = response.data
        else if (response.data?.data) data = response.data.data

        setAvdTab3Data(data)

        console.log('Réponse backend : ', response)
      } catch (error) {
        toast.error(error.message)
      }
    }
    getTab3UserGuideFromNodeServer()
  }, [user, location.pathname])

  /**
   * Use to calculate totals amount of the products
  const totalProduits = products.reduce(
    (acc, p) => acc + Number(p.prixTotal || 0),
    0,
  )

  // For product
  const oceanFreight = parseFloat(shippingInfo.oceanFreight) || 0
  const insurance = parseFloat(shippingInfo.insurance) || 0
  const freeOnBoardFromOriginatePort = totalProduits
  const totalOperatingCost = totalProduits + oceanFreight + insurance

  
   * Use to calculate totals amount of the Vehicles
   
  const totalVehicles = vehicles.reduce(
    (acc, v) => acc + Number(v.prixTotal || 0),
    0,
  )

  // For Vehicle
  const oceanFreight_ = parseFloat(shippingInfo_.oceanFreight) || 0
  const insurance_ = parseFloat(shippingInfo_.insurance) || 0
  const freeOnBoardFromOriginatePort_ = totalVehicles
  const totalOperatingCost_ = totalVehicles + oceanFreight_ + insurance_

  */

  /**
   *This function is used to generate the product list and AVD
   */

  const toFloat = (v) => parseFloat(v) || 0

  const computeTotals = (items, shipping) => {
    const totalItems = items.reduce(
      (acc, item) => acc + Number(item.prixTotal || 0),
      0,
    )

    const oceanFreight = toFloat(shipping.oceanFreight)
    const insurance = toFloat(shipping.insurance)

    return {
      totalItems,
      oceanFreight,
      insurance,
      freeOnBoardFromOriginatePort: totalItems,
      totalOperatingCost: totalItems + oceanFreight + insurance,
    }
  }

  // For products
  const {
    totalItems: totalProduits,
    oceanFreight,
    insurance,
    freeOnBoardFromOriginatePort,
    totalOperatingCost,
  } = computeTotals(products, shippingInfo)

  // For vehicles
  const {
    totalItems: totalVehicles,
    oceanFreight: oceanFreight_, // Pour diferencier de oceanFreight de products - resultat du calcul
    insurance: insurance_,
    freeOnBoardFromOriginatePort: freeOnBoardFromOriginatePort_,
    totalOperatingCost: totalOperatingCost_,
  } = computeTotals(vehicles, shippingInfo)

  const sendProductInfoAndgeneratePdfFile = async () => {
    const errors = validateProducts(products, shippingInfo)
    if (errors.length > 0) {
      toast.error(
        'Certains champs sont manquants :\n\n' +
          errors.map((e) => e.message).join('\n'),
      )
      return
    }
    const errorShipping = validateShipping(shippingInfo)
    if (errorShipping.length > 0) {
      toast.error(
        'Certains champs sont manquants :\n\n' +
          errorShipping.map((e) => e.message).join('\n'),
      )
      return
    }
    const payload = {
      products: products.map((p) => ({
        nom: p.nom,
        description: p.description,
        longueurCm: p.longueurCm,
        largeurCm: p.largeurCm,
        poidsKg: p.poidsKg,
        quantity: p.quantity,
        numberOfBox: p.numberOfBox,
        prix: p.prix,
        devise: p.devise,
        prixTotal: p.prixTotal,
      })),
      shipping: {
        ...shippingInfo,
        freeOnBoardFromOriginatePort,
        totalOperatingCost,
      },
    }
    try {
      // Sans fichier --> await axios.post('/api/v1/business/create-pdf-file', payload)
      const formData = new FormData() //Avec fichiers (FormData)
      formData.append('products', JSON.stringify(payload.products))
      formData.append('shipping', JSON.stringify(payload.shipping))

      products.forEach((p, index) => {
        if (p.photo.size > MAX_SIZE) {
          toast.error("L'image dépasse 2 MO")
          return
        }
        formData.append(`photo_${index}`, p.photo)
      })

      const response = await axios.post(
        '/api/v1/business/product/generatepdf',
        formData,
        {
          withCredentials: true,
          responseType: 'blob', // Uniquement si ton backend renvoie un PDF
        },
      )
      toast.success('Formulaire envoyé avec succès!')
      //console.log('✅ Succès:', response.data)
      // 👉 Utiliser le vrai formulaire HTML
      const form = formRefTab2.current
      form.reset()

      // Réinitialiser les states React
      resetProducts()
      resetShipping()

      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Liste-des-produits.pdf'
      a.click()
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expirée, veuillez vous authentifier')
        return
      }
      if (error.response?.status === 403) {
        toast.error("Limite d'impression attente. Veuillez payer à nouveau")
        navigate('/businessapp')
      }
      // Cas 2 : autre erreur backend
      if (error.response?.data?.msg) {
        toast.error(error.response.data.msg)
        return
      }
      // Cas 3 : erreur réseau ou inconnue
      toast.error('Une erreur est survenue, veuillez réessayer')
    }
  }

  /**
   *This function is used to generate the product list and AVD
   */
  const sendVehicleInfoAndgeneratePdfFile = async () => {
    const errors = validateVehicles(vehicles, shippingInfo)
    if (errors.length > 0) {
      toast.error(
        'Certains champs sont manquants :\n\n' +
          errors.map((e) => e.message).join('\n'),
      )
      return
    }

    const payload = {
      vehicles: vehicles.map((vehicle) => ({
        type: vehicle.type,
        marque: vehicle.marque,
        kilometrage: vehicle.kilometrage,
        puissanceFiscal: vehicle.puissanceFiscal,
        anneeFabrication: vehicle.anneeFabrication,
        motorisation: vehicle.motorisation,
        description: vehicle.description,
        longueurCm: vehicle.longueurCm,
        largeurCm: vehicle.largeurCm,
        hauteurCm: vehicle.hauteurCm,
        poidsKg: vehicle.poidsKg,
        quantity: vehicle.quantity,
        prix: vehicle.prix,
        devise: vehicle.devise,
        prixTotal: vehicle.prixTotal,
      })),
      shipping: {
        ...shippingInfo,
        freeOnBoardFromOriginatePort_,
        totalOperatingCost_,
      },
    }

    try {
      const formData = new FormData() //Avec fichiers (FormData)
      formData.append('vehicles', JSON.stringify(payload.vehicles))
      formData.append('shipping', JSON.stringify(payload.shipping))

      vehicles.forEach((v, index) => {
        if (v.photo.size > MAX_SIZE) {
          toast.error("L'image dépasse 2 MO")
          return
        }
        formData.append(`photo_${index}`, v.photo)
      })

      const response = await axios.post(
        '/api/v1/business/vehicle/generatepdf',
        formData,
        {
          withCredentials: true,
          responseType: 'blob', // Uniquement si ton backend renvoie un PDF
        },
      )
      console.log(response)
      toast.success('Formulaire envoyé avec succès!')
      const form = formRefTab3.current
      form.reset()

      // Réinitialiser les states React
      resetVehicle()
      resetShipping()
      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Liste-de-voitures.pdf'
      a.click()
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expirée, veuillez vous authentifier')
        return
      }
      if (error.response?.status === 403) {
        toast.error("Limite d'impression attente. Veuillez payer à nouveau")
        navigate('/businessapp')
      }
      // Cas 2 : autre erreur backend
      if (error.response?.data?.msg) {
        toast.error(error.response.data.msg)
        return
      }
      // Cas 3 : erreur réseau ou inconnue
      toast.error('Une erreur est survenue, veuillez réessayer')
    }
  }

  return (
    <>
      {/* HEADER */}
      <Header />
      <div className={styles.contentWrapper}>
        {/* ASIDE */}
        <aside className={styles.sidebar}>
          <nav className={styles.menu}>
            {MENU_ITEMS_AVD.map(({ id, title, short, icon: Icon }) => (
              <li
                key={id}
                className={activeTab === id ? styles.activeItem : ''}
              >
                <div
                  className={styles.parentLine}
                  onClick={() => setActiveTab(id)}
                >
                  {/* Icône */}
                  <span className={styles.iconWrapper}>
                    <Icon className={styles.icon} />
                  </span>

                  {/* Titre court */}
                  <span className={styles.label}>{short || title}</span>
                </div>
              </li>
            ))}
          </nav>
          <div className={styles.sidebarUserWrapper}>
            <div
              className={styles.sidebarUser}
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <span className={styles.sidebarUserIcon}>
                <FaUserCircle />
              </span>
              {user ? (
                <span className={styles.username}>{user.prenom}</span>
              ) : (
                <span>Utilisateur</span>
              )}
            </div>
            {showMenu && (
              <div className={styles.userDisconnectBtn}>
                <button onClick={handleLogout}>🔓 Déconnexion</button>
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
        </aside>
        {/* MAIN */}
        <main className={styles.layoutMain}>
          <div>
            {activeTab === 'TAB1' && (
              <div className='guide-card'>
                {console.log('AVD Simulator DATA =', avdSimulatorData)}
                <GuideRenderer data={avdSimulatorData} error={error} />
              </div>
            )}
            {/* TAB 2 */}
            {/* Une seule expression JSX ne peut retourner qu’un seul élément parent */}
            {/* Utiliser Fragment */}
            {activeTab === 'TAB2' && (
              <>
                <div className={'styles.card'}>
                  <GuideRenderer data={avdTab2Data} error={error} />
                </div>

                <div className={'styles.card'}>
                  <fieldset className={styles.formFieldset}>
                    <legend className={styles.formLegend}>
                      dDSimulator v1.0
                    </legend>
                    <form
                      id='avd-form-tab2'
                      ref={formRefTab2}
                      className={styles.form}
                    >
                      {products.map((produit, index) => (
                        <div key={index} className={styles.productCard}>
                          {/* NOM + DESCRIPTION */}
                          <h2>Information relative au produit</h2>
                          <div className={styles.grid2}>
                            <div>
                              <label>Nom</label>
                              <input
                                type='text'
                                value={produit.nom}
                                placeholder='Nom du produit * '
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^0-9a-zA-ZÀ-ÿ., ()']/g,
                                    '',
                                  )
                                  if (value.length <= 100)
                                    updateProduct(index, 'nom', value)
                                }}
                              />
                            </div>
                            <div>
                              <label>Description</label>
                              <input
                                type='text'
                                value={produit.description}
                                placeholder='Description du produit *'
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^0-9a-zA-ZÀ-ÿ., ()']/g,
                                    '',
                                  )

                                  if (value.length <= 150)
                                    updateProduct(index, 'description', value)
                                }}
                              />
                            </div>
                          </div>

                          {/* DIMENSIONS */}
                          <div className={styles.grid3}>
                            <div>
                              <label>Longueur (cm)</label>
                              <input
                                type='number'
                                value={produit.longueurCm}
                                placeholder='Longueur (cm) *'
                                onChange={(e) => {
                                  const value = e.target.value
                                  if (value.length <= 5)
                                    updateProduct(index, 'longueurCm', value)
                                }}
                              />
                            </div>
                            <div>
                              <label>Largeur (cm)</label>
                              <input
                                type='number'
                                value={produit.largeurCm}
                                placeholder='Largeur (cm) *'
                                onChange={(e) => {
                                  const value = e.target.value
                                  if (value.length <= 5)
                                    updateProduct(index, 'largeurCm', value)
                                }}
                              />
                            </div>
                            <div>
                              <label>Poids (Kg)</label>
                              <input
                                type='number'
                                value={produit.poidsKg}
                                placeholder='Poids (Kg) *'
                                onChange={(e) => {
                                  const value = e.target.value
                                  if (value.length <= 5)
                                    updateProduct(index, 'poidsKg', value)
                                }}
                              />
                            </div>
                          </div>
                          {/* QUANTITÉ + CARTONS + PRIX */}
                          <div className={styles.grid3}>
                            <div>
                              <label>Quantité</label>
                              <input
                                type='number'
                                min='0'
                                value={produit.quantity}
                                placeholder='Quantité *'
                                onChange={(e) => {
                                  const value = e.target.value
                                  if (value.length <= 5)
                                    updateProduct(index, 'quantity', value)
                                }}
                              />
                            </div>
                            <div>
                              <label>Nombre de cartons</label>
                              <input
                                type='number'
                                value={produit.numberOfBox}
                                placeholder='Nbre de cartons *'
                                onChange={(e) => {
                                  const value = e.target.value
                                  if (value.length <= 3)
                                    updateProduct(index, 'numberOfBox', value)
                                }}
                              />
                            </div>
                            <div>
                              <label>Prix unitaire</label>
                              <input
                                type='number'
                                step='0.01'
                                value={produit.prix}
                                placeholder='Prix unitaire *'
                                onChange={(e) => {
                                  const value = e.target.value
                                  if (value.length <= 10)
                                    updateProduct(index, 'prix', value)
                                }}
                              />
                            </div>
                          </div>

                          {/* TOTAL */}
                          <div>
                            <label>Prix total</label>
                            <input
                              type='number'
                              value={produit.prixTotal}
                              readOnly
                            />
                          </div>
                          {/* DEVISE */}
                          <div>
                            <div>
                              <label>Devise</label>
                              <select
                                value={products.devise}
                                onChange={(e) =>
                                  updateShipping('devise', e.target.value)
                                }
                              >
                                <option value=''>Choisir une devise</option>
                                <option value='EUR'>EUR (€)</option>
                                <option value='USD'>USD ($)</option>
                                <option value='GBP'>GBP (£)</option>
                                <option value='CHF'>CHF (Fr)</option>
                                <option value='CAD'>CAD ($)</option>
                                <option value='XOF'>XOF (CFA)</option>
                                <option value='XAF'>XAF (CFA)</option>
                              </select>
                            </div>
                          </div>

                          {/* PHOTO */}
                          <div className={styles.fileInput}>
                            <label>Photo du produit</label>
                            <input
                              type='file'
                              accept='image/*'
                              onChange={(e) =>
                                updateProduct(index, 'photo', e.target.files[0])
                              }
                            />
                          </div>
                          {/* BOUTON SUPPRIMER */}
                          <button
                            type='button'
                            className={styles.deleteBtn}
                            onClick={() => removeProduct(index)}
                          >
                            Supprimer ce produit
                          </button>
                        </div>
                      ))}

                      {/* BOUTON AJOUTER */}
                      <div className={styles.btnContainer}>
                        <button
                          type='button'
                          className={styles.addBtn}
                          onClick={addProduct}
                        >
                          Ajouter un produit
                        </button>
                      </div>
                      <div className={styles.section}>
                        <h2>Information relative au fret maritime</h2>
                        <div className={styles.grid2}>
                          <div>
                            <label>Prix Fret maritime</label>
                            <input
                              type='number'
                              min='0'
                              step='0.01'
                              placeholder='Prix du fret maritime'
                              value={shippingInfo.oceanFreight}
                              onChange={(e) => {
                                let value = e.target.value
                                value = value.replace(/^0+(?=\d)/, '') // empêche les zéros en tête
                                if (value.length <= 10) {
                                  updateShipping('oceanFreight', value)
                                }
                              }}
                            />
                          </div>
                          <div>
                            <label>Assurance transport maritime</label>
                            <input
                              type='number'
                              min='0'
                              step='0.01'
                              placeholder='Assurance'
                              value={shippingInfo.insurance}
                              onChange={(e) => {
                                const value = e.target.value
                                if (value.length <= 5) {
                                  updateShipping('insurance', value)
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className={styles.grid2}>
                          <div>
                            <label>Total global</label>
                            <input
                              type='number'
                              min='0'
                              placeholder={`Total des produits : ${totalProduits}`}
                              value={freeOnBoardFromOriginatePort}
                              readOnly
                            />
                          </div>
                          <div>
                            <label>Total Cost Insurance & Freight</label>
                            <input
                              type='number'
                              placeholder="Total coût d'opération maritime"
                              value={totalOperatingCost}
                              readOnly
                            />
                          </div>
                        </div>
                        <div>
                          <label>Devise</label>
                          <select
                            value={shippingInfo.devise}
                            onChange={(e) =>
                              updateShipping('devise', e.target.value)
                            }
                          >
                            <option value=''>Choisir une devise</option>
                            <option value='EUR'>EUR (€)</option>
                            <option value='USD'>USD ($)</option>
                            <option value='GBP'>GBP (£)</option>
                            <option value='CHF'>CHF (Fr)</option>
                            <option value='CAD'>CAD ($)</option>
                            <option value='XOF'>XOF (CFA)</option>
                            <option value='XAF'>XAF (CFA)</option>
                          </select>
                        </div>
                        <div>
                          <label>Incoterm</label>
                          <select
                            value={shippingInfo.incoterm}
                            onChange={(e) =>
                              updateShipping('incoterm', e.target.value)
                            }
                          >
                            <option value=''>Choisir un incoterm</option>
                            <option value='EXW'>EXW</option>
                            <option value='FOB'>FOB</option>
                            <option value='CFR'>CFR</option>
                            <option value='CIF'>CIF</option>
                          </select>
                        </div>
                      </div>
                      <div className={styles.actions}>
                        <button
                          type='button'
                          className={styles.primaryBtn}
                          onClick={() =>
                            /*validationFormulaireAVD() &&*/
                            sendProductInfoAndgeneratePdfFile()
                          }
                        >
                          Générer & simuler les droits
                        </button>
                      </div>
                    </form>
                  </fieldset>
                </div>
              </>
            )}
            {/* TAB 3 */}
            {activeTab === 'TAB3' && (
              <div className={'styles.card'}>
                <div className={'styles.card'}>
                  <GuideRenderer data={avdTab3Data} error={error} />
                </div>
                <fieldset className={styles.formFieldset}>
                  <legend className={styles.formLegend}>
                    dDSimulator v1.0
                  </legend>
                  <form
                    id='avd-form-tab3'
                    ref={formRefTab3}
                    className={styles.form}
                  >
                    {vehicles.map((vehicle, index) => (
                      <div key={index} className={styles.productCard}>
                        {/* NOM + DESCRIPTION */}
                        <h2>Information relative au vehicule</h2>

                        <div>
                          <label>Type de véhicule</label>
                          <select
                            value={vehicle.type}
                            onChange={(e) =>
                              updateVehicle(index, 'type', e.target.value)
                            }
                          >
                            <option value=''>Type de véhicule</option>
                            <option value='Neuf'>Neuf</option>
                            <option value='Occasion'>Occasion</option>
                          </select>
                        </div>
                        <div>
                          <label>Marque</label>
                          <input
                            type='text'
                            value={vehicle.marque}
                            placeholder='Marque du vehicule *'
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9a-zA-ZÀ-ÿ., ()']/g,
                                '',
                              )

                              if (value.length <= 50)
                                updateVehicle(index, 'marque', value)
                            }}
                          />
                        </div>
                        <div>
                          <label>Année de Fabrication</label>
                          <select
                            value={vehicle.anneeFabrication}
                            onChange={(e) => {
                              console.log('Année choisie :', e.target.value)
                              updateVehicle(
                                index,
                                'anneeFabrication',
                                Number(e.target.value),
                              )
                            }}
                          >
                            <option value=''>Sélectionner une année</option>
                            {Array.from(
                              { length: new Date().getFullYear() - 1950 + 1 },
                              (_, i) => new Date().getFullYear() - i,
                            ).map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label>Kilométrage</label>
                          <input
                            type='number'
                            step='0.01'
                            min='0'
                            value={vehicle.kilometrage}
                            placeholder='Kilométrage *'
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 10)
                                updateVehicle(index, 'kilometrage', value)
                            }}
                          />
                        </div>

                        <div>
                          <label>Puissance Fiscale</label>
                          <input
                            type='number'
                            step='0.01'
                            min='0'
                            value={vehicle.puissanceFiscal}
                            placeholder='Puissance / chevaux fiscaux *'
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 10)
                                updateVehicle(index, 'puissanceFiscal', value)
                            }}
                          />
                        </div>
                        <div>
                          <label>Motorisation</label>
                          <select
                            value={vehicle.motorisation}
                            onChange={(e) =>
                              updateVehicle(
                                index,
                                'motorisation',
                                e.target.value,
                              )
                            }
                          >
                            <option value=''>Motorisation</option>
                            <option value='Essence'>Essence</option>
                            <option value='Diesel'>Diesel</option>
                            <option value='Electrique'>Electrique</option>
                            <option value='Hybride'>Hybride</option>
                          </select>
                        </div>
                        <div>
                          <label>Description</label>
                          <input
                            type='text'
                            value={vehicle.description}
                            placeholder='Description du vehicule *'
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9a-zA-ZÀ-ÿ., ()']/g,
                                '',
                              )

                              if (value.length <= 150)
                                updateVehicle(index, 'description', value)
                            }}
                          />
                        </div>
                        <div className={styles.grid3}>
                          <div>
                            <label>Longueur (cm)</label>
                            <input
                              type='number'
                              min='0'
                              step='0.01'
                              value={vehicle.longueurCm}
                              placeholder='Longueur (cm) *'
                              onChange={(e) => {
                                const value = e.target.value
                                if (value.length <= 5)
                                  updateVehicle(index, 'longueurCm', value)
                              }}
                            />
                          </div>
                          <div>
                            <label>Largeur (cm)</label>
                            <input
                              type='number'
                              step='0.01'
                              min='0'
                              value={vehicle.largeurCm}
                              placeholder='Largeur (cm) *'
                              onChange={(e) => {
                                const value = e.target.value
                                if (value.length <= 5)
                                  updateVehicle(index, 'largeurCm', value)
                              }}
                            />
                          </div>
                          <div>
                            <label>Hauteur (cm)</label>
                            <input
                              type='number'
                              step='0.01'
                              min='0'
                              value={vehicle.hauteurCm}
                              placeholder='Hauteur (cm) *'
                              onChange={(e) => {
                                const value = e.target.value
                                if (value.length <= 5)
                                  updateVehicle(index, 'hauteurCm', value)
                              }}
                            />
                          </div>
                          <div>
                            <label>Poids (Kg)</label>
                            <input
                              type='number'
                              step='0.01'
                              min='0'
                              value={vehicle.poidsKg}
                              placeholder='Poids (Kg) *'
                              onChange={(e) => {
                                const value = e.target.value
                                if (value.length <= 5)
                                  updateVehicle(index, 'poidsKg', value)
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <label>Quantité</label>
                          <input
                            type='number'
                            min='0'
                            value={vehicle.quantity}
                            placeholder='Quantité *'
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 5)
                                updateVehicle(index, 'quantity', value)
                            }}
                          />
                        </div>

                        <div>
                          <label>Prix d'achat</label>
                          <input
                            type='number'
                            step='0.01'
                            min='0'
                            value={vehicle.prix}
                            placeholder="Prix d'achat *"
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 10)
                                updateVehicle(index, 'prix', value)
                            }}
                          />
                        </div>

                        <div>
                          <label>Prix total</label>
                          <input
                            type='number'
                            value={vehicle.prixTotal}
                            readOnly
                          />
                        </div>
                        {/* DEVISE */}
                        <div>
                          <div>
                            <label>Devise</label>
                            <select
                              value={vehicle.devise}
                              onChange={(e) =>
                                updateVehicle(index, 'devise', e.target.value)
                              }
                            >
                              <option value=''>Choisir une devise</option>
                              <option value='EUR'>EUR (€)</option>
                              <option value='USD'>USD ($)</option>
                              <option value='GBP'>GBP (£)</option>
                              <option value='CHF'>CHF (Fr)</option>
                              <option value='CAD'>CAD ($)</option>
                              <option value='XOF'>XOF (CFA)</option>
                              <option value='XAF'>XAF (CFA)</option>
                            </select>
                          </div>
                        </div>

                        {/* PHOTO */}
                        <div className={styles.fileInput}>
                          <label>Photo du Véhicule</label>
                          <input
                            type='file'
                            accept='image/*'
                            onChange={(e) =>
                              updateVehicle(index, 'photo', e.target.files[0])
                            }
                          />
                        </div>
                        {/* BOUTON SUPPRIMER */}
                        <button
                          type='button'
                          className={styles.deleteBtn}
                          onClick={() => removeVehicle(index)}
                        >
                          Supprimer véhicule
                        </button>
                      </div>
                    ))}
                    {/* BOUTON AJOUTER */}
                    <div className={styles.btnContainer}>
                      <button
                        type='button'
                        className={styles.addBtn}
                        onClick={addVehicle}
                      >
                        Ajouter un véhicule
                      </button>
                    </div>
                    <div className={styles.section}>
                      <h2>Coûts d’expédition maritime</h2>
                      <div className={styles.grid2}>
                        <div>
                          <label>Prix Fret maritime</label>
                          <input
                            type='number'
                            min='0'
                            step='0.01'
                            placeholder='Prix du fret maritime'
                            value={shippingInfo.oceanFreight}
                            onChange={(e) => {
                              let value = e.target.value
                              value = value.replace(/^0+(?=\d)/, '') // empêche les zéros en tête
                              if (value.length <= 10) {
                                updateShipping('oceanFreight', value)
                              }
                            }}
                          />
                        </div>
                        <div>
                          <label>Assurance transport maritime</label>
                          <input
                            type='number'
                            min='0'
                            step='0.01'
                            placeholder='Assurance'
                            value={shippingInfo.insurance}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 5) {
                                updateShipping('insurance', value)
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className={styles.grid2}>
                        <div>
                          <label>Total global</label>
                          <input
                            type='number'
                            placeholder={`Total des produits : ${totalVehicles}`}
                            value={freeOnBoardFromOriginatePort_}
                            readOnly
                          />
                        </div>
                        <div>
                          <label>Total Cost Insurance & Freight</label>
                          <input
                            type='number'
                            min='0'
                            step='0.01'
                            placeholder="Total coût d'opération maritime"
                            value={totalOperatingCost_}
                            readOnly
                          />
                        </div>
                      </div>
                      <div>
                        <label>Devise</label>
                        <select
                          value={shippingInfo.devise}
                          onChange={(e) =>
                            updateShipping('devise', e.target.value)
                          }
                        >
                          <option value=''>Choisir une devise</option>
                          <option value='EUR'>EUR (€)</option>
                          <option value='USD'>USD ($)</option>
                          <option value='GBP'>GBP (£)</option>
                          <option value='CHF'>CHF (Fr)</option>
                          <option value='CAD'>CAD ($)</option>
                          <option value='XOF'>XOF (CFA)</option>
                          <option value='XAF'>XAF (CFA)</option>
                          <option value='CAD'>CAD ($)</option>
                        </select>
                      </div>
                      <div>
                        <label>Incoterm</label>
                        <select
                          value={shippingInfo.incoterm}
                          onChange={(e) =>
                            updateShipping('incoterm', e.target.value)
                          }
                        >
                          <option value=''>Choisir un incoterm</option>
                          <option value='EXW'>EXW</option>
                          <option value='FOB'>FOB</option>
                          <option value='CFR'>CFR</option>
                          <option value='CIF'>CIF</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <button
                        type='button'
                        className={styles.primaryBtn}
                        onClick={() =>
                          /*validationFormulaireAVD() &&*/
                          sendVehicleInfoAndgeneratePdfFile()
                        }
                      >
                        Générer & simuler les droits
                      </button>
                    </div>
                  </form>
                </fieldset>
              </div>
            )}
          </div>
        </main>
      </div>
      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>© 2026 ZTravel Consulting — All rights reserved</p>
      </footer>
    </>
  )
}
