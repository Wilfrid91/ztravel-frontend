import { useState } from 'react'
import { toast } from 'react-toastify'
/**
 *
 * @returns Transformer sa propre fonction en HOOK react avec le prefixe use
 */
export function useProductHandler() {
  /**
   * State initial propre
   * @returns
   */
  const emptyProduct = () => ({
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
  })

  const [products, setProducts] = useState([emptyProduct()])

  /**
   * mise à jour + recalcul automatique
   * @param {*} index
   * @param {*} field
   * @param {*} value
   */
  const updateProduct = (index, field, value) => {
    const updated = [...products]
    updated[index][field] = value

    // recalcul automatique du total
    if (field === 'prix' || field === 'quantity') {
      const p = updated[index]
      updated[index].prixTotal =
        (Number(p.prix) || 0) * (Number(p.quantity) || 0)
    }

    setProducts(updated)
  }

  /**
   * Ajouter un produit
   */
  const addProduct = () => {
    setProducts([...products, emptyProduct()])
  }

  /**
   * Supprimer un produit (mais jamais le dernier)
   * @param {*} index
   * @returns
   */
  const removeProduct = (index) => {
    if (products.length === 1) {
      toast.error('Vous devez garder au moins un produit.')
      return
    }

    setProducts(products.filter((_, i) => i !== index))
  }

  function resetProducts() {
    setProducts([emptyProduct()])
  }

  function validateProducts(products, shipping) {
    const errors = []

    products.forEach((p, index) => {
      const missing = []

      if (!p.nom?.trim()) missing.push('Nom')
      if (!p.description?.trim()) missing.push('Description')
      if (!p.longueurCm) missing.push('Longueur')
      if (!p.largeurCm) missing.push('Largeur')
      if (!p.poidsKg) missing.push('Poids')
      if (!p.quantity) missing.push('Quantité')
      if (!p.numberOfBox) missing.push('Nombre de cartons')
      if (!p.prix) missing.push('Prix unitaire')
      if (!p.prixTotal) missing.push('Prix total')
      if (!p.photo) missing.push('Photo')
      if (!p.devise) missing.push('Devise')
      if (!p.photo) missing.push('Photo')

      if (missing.length > 0) {
        errors.push({
          index,
          message: `Produit ${index + 1} : champs manquants → ${missing.join(', ')}`,
        })
      }
    })

    return errors
  }
  // use by the handler
  return {
    products,
    emptyProduct,
    updateProduct,
    addProduct,
    removeProduct,
    validateProducts,
    resetProducts,
  }
}
// Shipping handler
export function useShippingHandler() {
  const [shippingInfo, setShippingInfo] = useState({
    oceanFreight: 0,
    insurance: 0,
    devise: 'EUR',
    incoterm: '',
    otherCharges: 0, // Eincoterms -> EXWORKS
  })

  const updateShipping = (field, value) => {
    setShippingInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  function resetShipping() {
    setShippingInfo({
      oceanFreight: 0,
      insurance: 0,
      devise: 'EUR',
      incoterm: '',
      otherCharges: 0,
    })
  }

  function validateShipping(shippingInfo) {
    const errors = []
    const missing = []
    //ShippingInfo est un objet, tu dois valider ses propriétés directement :
    if (!shippingInfo.devise?.trim()) missing.push('Devise')
    if (!shippingInfo.incoterm?.trim()) missing.push('Incoterm')

    if (missing.length > 0) {
      errors.push({
        message: `Shipping : champs manquants → ${missing.join(', ')}`,
      })
    }

    return errors
  }

  return {
    shippingInfo,
    updateShipping,
    validateShipping,
    resetShipping,
  }
}

export const useShippingHandlerVehicle = () => {
  const [shippingInfo, setShippingInfo] = useState({
    oceanFreight: 0,
    insurance: 0,
    devise: 'EUR',
    incoterm: '',
    otherCharges: 0, // Eincoterms -> EXWORKS
  })

  const updateShipping = (field, value) => {
    setShippingInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  function resetShipping() {
    setShippingInfo({
      oceanFreight: 0,
      insurance: 0,
      devise: 'EUR',
      incoterm: '',
      otherCharges: 0,
    })
  }

  function validateShipping(shippingInfo) {
    const errors = []
    const missing = []
    //ShippingInfo est un objet, tu dois valider ses propriétés directement :
    if (!shippingInfo.devise?.trim()) missing.push('Devise')
    if (!shippingInfo.incoterm?.trim()) missing.push('Incoterm')

    if (missing.length > 0) {
      errors.push({
        message: `Shipping : champs manquants → ${missing.join(', ')}`,
      })
    }

    return errors
  }

  return {
    shippingInfo,
    updateShipping,
    validateShipping,
    resetShipping,
  }
}
// For cars
export function useVehicleHandler() {
  const initVehicle = () => ({
    type: '',
    marque: '',
    kilometrage: '',
    puissanceFiscal: '', // puissance fiscal
    AnneeFabrication: '',
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
  })

  const [vehicles, setVehicles] = useState([initVehicle()])

  /**
   * Ajouter une voiture à la liste
   */
  const addVehicle = () => {
    setVehicles([...vehicles, initVehicle()])
  }

  /**
   * Supprimer des véhicules
   */

  const removeVehicle = (index) => {
    if (vehicles.length === 1) {
      toast.error('Vous devez garder au moins un produit.')
      return
    }

    setVehicles(vehicles.filter((_, i) => i !== index))
  }

  function validateVehicles(vehicles, shipping) {
    const errors = []

    vehicles.forEach((v, index) => {
      const missing = []

      if (!v.marque?.trim()) missing.push('marque')
      if (!v.description?.trim()) missing.push('Description')
      if (!v.kilometrage?.trim()) missing.push('Kilometrage')
      if (!v.longueurCm) missing.push('Longueur')
      if (!v.largeurCm) missing.push('Largeur')
      if (!v.poidsKg) missing.push('Poids')
      if (!v.quantity) missing.push('Quantité')
      if (!v.puissanceFiscal) missing.push('Puissance Fiscal en chevaux')
      if (!v.AnneeFabrication) missing.push('Annee de fabrication')
      if (!v.motorisation) missing.push('Motorisation')
      if (!v.prixTotal) missing.push('Prix total')
      if (!v.devise) missing.push('Devise')
      if (!v.photo) missing.push('Photo')

      if (missing.length > 0) {
        errors.push({
          index,
          message: `Vehicule ${index + 1} : champs manquants → ${missing.join(', ')}`,
        })
      }
    })
    return errors
  }

  /**
   * mise à jour + recalcul automatique
   * @param {*} index
   * @param {*} field
   * @param {*} value
   */
  const updateVehicle = (index, field, value) => {
    const updated = [...vehicles]
    updated[index][field] = value
    console.log(' updated[index][field]= ', updated[index][field])

    // recalcul automatique du total
    if (field === 'prix' || field === 'quantity') {
      const p = updated[index]
      updated[index].prixTotal =
        (Number(p.prix) || 0) * (Number(p.quantity) || 0)
    }

    setVehicles(updated)
  }

  const resetVehicles = () => {
    setVehicles([initVehicle()])
  }

  // use by the handler
  return {
    vehicles,
    initVehicle,
    updateVehicle,
    addVehicle,
    removeVehicle,
    validateVehicles,
    resetVehicles,
  }
}
