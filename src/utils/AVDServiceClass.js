import { useState } from 'react'

export class ListHandler {
  constructor(createItem) {
    this.createItem = createItem
  }

  initList() {
    return [this.createItem()]
  }

  add(list, setList) {
    setList([...list, this.createItem()])
  }

  remove(list, setList, index) {
    if (list.length === 1) return
    setList(list.filter((_, i) => i !== index))
  }

  update(list, setList, index, field, value, computeTotal) {
    const updated = [...list]
    updated[index][field] = value

    // recalcul automatique AVANT setState
    if (computeTotal) computeTotal(updated[index])

    setList(updated)
  }

  reset(setList) {
    setList([this.createItem()])
  }
}

/**
 * Gestionnaire de produits
 */
export class ProductHandler {
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

  computeTotal(product) {
    product.prixTotal =
      (parseFloat(product.prix) || 0) * (parseFloat(product.quantity) || 0)
  }
}

/**
 * Gestionnaire de vehicule
 */
export class VehicleHandler {
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

  computeTotal(vehicle) {
    vehicle.prixTotal =
      (parseFloat(vehicle.prix) || 0) * (parseFloat(vehicle.quantity) || 0)
  }

  validate(vehicle) {
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
      (f) =>
        !vehicle[f] || (typeof vehicle[f] === 'string' && !vehicle[f].trim()),
    )
  }
}

/**
 * Gestionnaire des frais d'expedition
 */
export class ShippingHandler {
  create() {
    return {
      oceanFreight: 0,
      insurance: 0,
      devise: 'EUR',
      incoterm: '',
      otherCharges: 0,
    }
  }

  update(shipping, field, value) {
    shipping[field] = value
  }

  reset() {
    return this.create()
  }

  validate(shipping) {
    const required = ['devise', 'incoterm']

    return required.filter(
      (f) =>
        !shipping[f] ||
        (typeof shipping[f] === 'string' && !shipping[f].trim()),
    )
  }
}

/**
 * Hook générique pour gérer une liste
 */
export function useListHandler(ItemClass) {
  const itemHandler = new ItemClass()
  const listHandler = new ListHandler(() => itemHandler.create())

  const [items, setItems] = useState(listHandler.initList())

  const update = (index, field, value) => {
    listHandler.update(
      items,
      setItems,
      index,
      field,
      value,
      itemHandler.computeTotal?.bind(itemHandler),
    )
  }

  const validateList = (items, shipping) => {
    if (!itemHandler.validate) return []

    const errors = []

    items.forEach((item, index) => {
      const missing = itemHandler.validate(item, shipping)
      if (missing.length > 0) {
        errors.push({
          index,
          message: `Élément ${index + 1} : champs manquants → ${missing.join(', ')}`,
        })
      }
    })

    return errors
  }

  return {
    items,
    add: () => listHandler.add(items, setItems), // Ecriture de nouvelle fonctions
    remove: (i) => listHandler.remove(items, setItems, i), // Idem
    update, // update: Expositon, sans appel
    reset: () => listHandler.reset(setItems), // Idem
    validateList,
  }
}

/**
 * Hook générique pour gérer un seul objet
 */
export function useHandler(HandlerClass) {
  const handler = new HandlerClass()
  const [state, setState] = useState(handler.create())

  const update = (field, value) => {
    const updated = { ...state }
    handler.update(updated, field, value)
    setState(updated)
  }

  const reset = () => {
    setState(handler.reset())
  }

  const validate = () => {
    const missing = handler.validate(state)
    if (missing.length === 0) return []

    return [
      {
        message: `Shipping : champs manquants → ${missing.join(', ')}`,
      },
    ]
  }

  return {
    state,
    update,
    reset,
    validate,
  }
}
