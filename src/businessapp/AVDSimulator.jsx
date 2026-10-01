import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import axios from '../utils/axiosInstance'
import GuideRenderer from './components/GuideRendererAvd'
import ProductForm from './ProductForm'
import VehicleForm from './VehicleForm'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SidebarNav from './components/SidebarNav'
import styles from '../styles/AVDSimulator.module.css'

// ---------- Classes de gestion ----------
class ProductManager {
  create() {
    return {
      nom: '',
      description: '',
      longueurCm: '',
      largeurCm: '',
      poidsKg: '',
      quantity: '',
      numberOfBox: '',
      prix: '',
      prixTotal: 0,
      photo: null,
      devise: 'EUR',
    }
  }
  computeTotal(item) {
    item.prixTotal =
      (parseFloat(item.prix) || 0) * (parseFloat(item.quantity) || 0)
  }
}

class VehicleManager {
  create() {
    return {
      type: '',
      marque: '',
      kilometrage: '',
      puissanceFiscal: '',
      anneeFabrication: '',
      motorisation: '',
      description: '',
      longueurCm: '',
      largeurCm: '',
      hauteurCm: '',
      poidsKg: '',
      quantity: '',
      prix: '',
      prixTotal: 0,
      photo: null,
      devise: 'EUR',
    }
  }
  computeTotal(item) {
    item.prixTotal =
      (parseFloat(item.prix) || 0) * (parseFloat(item.quantity) || 0)
  }
  validate(item) {
    const required = [
      'type',
      'marque',
      'description',
      'puissanceFiscal',
      'anneeFabrication',
      'motorisation',
      'kilometrage',
      'longueurCm',
      'largeurCm',
      'hauteurCm',
      'poidsKg',
      'quantity',
      'prixTotal',
      'devise',
      'photo',
    ]
    return required.filter(
      (field) =>
        !item[field] ||
        (typeof item[field] === 'string' && !item[field].trim()),
    )
  }
}

class ShippingManager {
  create() {
    return {
      oceanFreight: 0,
      insurance: 0,
      devise: 'EUR',
      incoterm: '',
      otherCharges: 0,
      freeOnBoardFromOriginatePort: 0,
      totalOperatingCost: 0,
    }
  }
  update(state, field, value) {
    state[field] = value
  }
  reset() {
    return this.create()
  }
  validate(state) {
    const required = ['devise', 'incoterm']
    return required.filter(
      (field) =>
        !state[field] ||
        (typeof state[field] === 'string' && !state[field].trim()),
    )
  }
}

function useList(Manager) {
  const manager = new Manager()
  const [items, setItems] = useState([manager.create()])
  const add = () => setItems([...items, manager.create()])
  const remove = (index) => {
    if (items.length === 1) return
    setItems(items.filter((_, i) => i !== index))
  }
  const update = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    if (manager.computeTotal) manager.computeTotal(newItems[index])
    setItems(newItems)
  }
  const reset = () => setItems([manager.create()])
  const validate = (items) => {
    if (!manager.validate) return []
    const errors = []
    items.forEach((item, index) => {
      const fields = manager.validate(item)
      if (fields.length > 0)
        errors.push({
          index,
          message: `Élément ${index + 1} : champs manquants → ${fields.join(', ')}`,
        })
    })
    return errors
  }
  return { items, add, remove, update, reset, validate }
}

// ---------- Composant principal ----------
const AVDSimulator = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('TAB1')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [tab1Data, setTab1Data] = useState([])
  const [tab2Data, setTab2Data] = useState([])
  const [tab3Data, setTab3Data] = useState([])

  const {
    items: products,
    add: addProduct,
    remove: removeProduct,
    update: updateProduct,
    reset: resetProducts,
    validate: validateProducts,
  } = useList(ProductManager)
  const {
    items: vehicles,
    add: addVehicle,
    remove: removeVehicle,
    update: updateVehicle,
    reset: resetVehicles,
    validate: validateVehicles,
  } = useList(VehicleManager)
  const shippingManager = new ShippingManager()
  const [shipping, setShipping] = useState(shippingManager.create())
  const MAX_FILE_SIZE = 2 * 1024 * 1024

  const closeSidebar = () => setSidebarOpen(false)

  const fileRefs = useRef([])

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  // TAB1 - Guide utilisateur
  useEffect(() => {
    if (!user || !location.pathname.startsWith('/avd-simulator')) return
    const fetchTab1 = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/v1/business/user-guide')
        setTab1Data(Array.isArray(response.data) ? response.data : [])
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTab1()
  }, [user, location.pathname])

  // TAB2
  useEffect(() => {
    if (!user || !location.pathname.startsWith('/avd-simulator')) return
    const fetchTab2 = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/v1/business/simulator-tab2')
        setTab2Data(
          Array.isArray(response.data)
            ? response.data
            : response.data?.data || [],
        )
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTab2()
  }, [user, location.pathname])

  // TAB3
  useEffect(() => {
    if (!user || !location.pathname.startsWith('/avd-simulator')) return
    const fetchTab3 = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/v1/business/simulator-tab3')
        setTab3Data(
          Array.isArray(response.data)
            ? response.data
            : response.data?.data || [],
        )
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTab3()
  }, [user, location.pathname])

  const calculateTotals = (items, shipping) => {
    const totalItems = items.reduce(
      (sum, item) => sum + Number(item.prixTotal || 0),
      0,
    )
    const oceanFreight = Number(shipping.oceanFreight) || 0
    const insurance = Number(shipping.insurance) || 0
    return {
      totalItems,
      oceanFreight,
      insurance,
      fob: totalItems,
      total: totalItems + oceanFreight + insurance,
    }
  }

  const productTotals = calculateTotals(products, shipping)
  const vehicleTotals = calculateTotals(vehicles, shipping)

  const handleGenerateProductPDF = async () => {
    const errors = validateProducts(products)
    if (errors.length > 0) {
      toast.error(
        `Champs manquants :\n${errors.map((e) => e.message).join('\n')}`,
      )
      return
    }
    const shippingErrors = shippingManager.validate(shipping)
    if (shippingErrors.length > 0) {
      toast.error(`Champs manquants : ${shippingErrors.join(', ')}`)
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append(
        'products',
        JSON.stringify(products.map((p) => ({ ...p, photo: undefined }))),
      )
      formData.append(
        'shipping',
        JSON.stringify({
          ...shipping,
          freeOnBoardFromOriginatePort: productTotals.fob,
          totalOperatingCost: productTotals.total,
        }),
      )
      products.forEach((p, i) => {
        if (p.photo && p.photo.size <= MAX_FILE_SIZE)
          formData.append(`photo_${i}`, p.photo)
      })
      const response = await axios.post(
        '/api/v1/business/product/generatepdf',
        formData,
        { withCredentials: true, responseType: 'blob' },
      )
      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = 'Liste-des-produits.pdf'
      link.click()
      window.URL.revokeObjectURL(url)
      toast.success('✅ PDF généré !')
      resetProducts()
      setShipping(shippingManager.reset())
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateVehiclePDF = async () => {
    const errors = validateVehicles(vehicles)
    if (errors.length > 0) {
      toast.error(
        `Champs manquants :\n${errors.map((e) => e.message).join('\n')}`,
      )
      return
    }

    const shippingErrors = shippingManager.validate(shipping)
    if (shippingErrors.length > 0) {
      toast.error(`Champs manquants : ${shippingErrors.join(', ')}`)
      return
    }

    // ⭐ Correction : enrichir shipping AVANT l'appel PDF
    shipping.freeOnBoardFromOriginatePort = vehicleTotals.fob
    shipping.totalOperatingCost = vehicleTotals.total

    setLoading(true)
    try {
      const formData = new FormData()

      formData.append(
        'vehicles',
        JSON.stringify(vehicles.map((v) => ({ ...v, photo: undefined }))),
      )

      formData.append('shipping', JSON.stringify(shipping))

      vehicles.forEach((v, i) => {
        if (v.photo && v.photo.size <= MAX_FILE_SIZE)
          formData.append(`photo_${i}`, v.photo)
      })

      const response = await axios.post(
        '/api/v1/business/vehicle/generatepdf',
        formData,
        { withCredentials: true, responseType: 'blob' },
      )

      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = 'Liste-de-vehicules.pdf'
      link.click()
      window.URL.revokeObjectURL(url)

      toast.success('✅ PDF généré !')
      // Réinitialiser les véhicules
      resetVehicles()
      // Réinitialiser le shipping
      setShipping(shippingManager.reset())
      // Réinitialiser les champs file
      fileRefs.current.forEach((ref) => {
        if (ref) ref.value = null
      })
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'TAB1':
        return <GuideRenderer data={tab1Data} error={error} />
      case 'TAB2':
        return (
          <>
            <GuideRenderer data={tab2Data} error={error} />
            <ProductForm
              products={products}
              onUpdate={updateProduct}
              onAdd={addProduct}
              onRemove={removeProduct}
              shipping={shipping}
              onShippingUpdate={(field, value) => {
                shippingManager.update(shipping, field, value)
                setShipping({ ...shipping })
              }}
              totals={productTotals}
              onSubmit={handleGenerateProductPDF}
              loading={loading}
            />
          </>
        )
      case 'TAB3':
        return (
          <>
            <GuideRenderer data={tab3Data} error={error} />
            <VehicleForm
              ref={fileRefs}
              vehicles={vehicles}
              onUpdate={updateVehicle}
              onAdd={addVehicle}
              onRemove={removeVehicle}
              shipping={shipping}
              onShippingUpdate={(field, value) => {
                shippingManager.update(shipping, field, value)
                setShipping({ ...shipping })
              }}
              totals={vehicleTotals}
              onSubmit={handleGenerateVehiclePDF}
              loading={loading}
            />
          </>
        )
      default:
        return <div>Onglet non trouvé</div>
    }
  }

  return (
    <div className={styles.AVDSimulatorLayout}>
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayActive : ''}`}
        onClick={closeSidebar}
      />
      <div className={styles.layoutWrapper}>
        <SidebarNav
          className={styles.sidebar}
          activeNav={activeTab}
          setActiveNav={setActiveTab}
          sidebarOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Colonne droite */}
        <main className={styles.mainContent}>{renderTabContent()}</main>
      </div>
      <Footer />
    </div>
  )
}

export default AVDSimulator
