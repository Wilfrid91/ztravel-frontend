import { useState, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import VehicleForm from './VehicleForm'
import ShippingForm from './ShippingForm'

export default function BusinessApp() {
  const [vehicles, setVehicles] = useState([])
  const [shipping, setShipping] = useState({
    oceanFreight: '',
    insurance: '',
    devise: '',
    incoterm: '',
  })

  const formRef = useRef(null)

  const addVehicle = () => {
    setVehicles([
      ...vehicles,
      {
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
        devise: '',
        prixTotal: '',
        photo: null,
      },
    ])
  }

  const updateVehicle = (index, field, value) => {
    const updated = [...vehicles]
    updated[index][field] = value

    if (field === 'prix' || field === 'quantity') {
      const p = Number(updated[index].prix || 0)
      const q = Number(updated[index].quantity || 0)
      updated[index].prixTotal = p * q
    }

    setVehicles(updated)
  }

  const removeVehicle = (index) => {
    const updated = vehicles.filter((_, i) => i !== index)
    setVehicles(updated)
  }

  const updateShipping = (field, value) => {
    setShipping({ ...shipping, [field]: value })
  }

  const totalProducts = vehicles.reduce(
    (sum, v) => sum + Number(v.prixTotal || 0),
    0,
  )

  const totalCIF =
    Number(shipping.oceanFreight || 0) +
    Number(shipping.insurance || 0) +
    totalProducts

  const handleSubmit = async () => {
    const missing = []

    vehicles.forEach((v, i) => {
      if (!v.type) missing.push(`Véhicule ${i + 1}: type manquant`)
      if (!v.marque) missing.push(`Véhicule ${i + 1}: marque manquante`)
      if (!v.quantity) missing.push(`Véhicule ${i + 1}: quantité manquante`)
      if (!v.prix) missing.push(`Véhicule ${i + 1}: prix manquant`)
      if (!v.devise) missing.push(`Véhicule ${i + 1}: devise manquante`)
    })

    if (!shipping.devise) missing.push('Devise shipping manquante')
    if (!shipping.incoterm) missing.push('Incoterm manquant')

    if (missing.length > 0) {
      toast.error('Champs manquants :\n\n' + missing.join('\n'))
      return
    }

    try {
      const formData = new FormData()

      formData.append('vehicles', JSON.stringify(vehicles))
      formData.append(
        'shipping',
        JSON.stringify({
          ...shipping,
          totalProducts,
          totalCIF,
        }),
      )

      vehicles.forEach((v, i) => {
        if (v.photo) formData.append(`photo_${i}`, v.photo)
      })

      const res = await axios.post(
        'http://localhost:5000/api/v1/business/vehicle/generatepdf',
        formData,
        { withCredentials: true, responseType: 'blob' },
      )

      toast.success('Formulaire envoyé avec succès !')
      formRef.current.reset()

      const blob = res.data
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Liste-de-voitures.pdf'
      a.click()
    } catch (err) {
      const status = err.response?.status
      const msg = err.response?.data?.msg

      if (status === 401)
        return toast.error('Session expirée, veuillez vous authentifier')

      if (status === 403) {
        toast.error("Limite d'impression atteinte. Veuillez payer à nouveau")
        window.location.href = '/businessapp'
        return
      }

      if (msg) return toast.error(msg)

      toast.error('Une erreur est survenue, veuillez réessayer')
    }
  }

  return (
    <div className='app-container'>
      <form ref={formRef}>
        <h1>Simulateur AVD — Véhicules</h1>

        {vehicles.map((v, i) => (
          <VehicleForm
            key={i}
            index={i}
            data={v}
            update={updateVehicle}
            remove={removeVehicle}
          />
        ))}

        <button type='button' onClick={addVehicle}>
          Ajouter un véhicule
        </button>

        <ShippingForm
          data={shipping}
          update={updateShipping}
          totalProducts={totalProducts}
          totalCIF={totalCIF}
        />

        <button type='button' onClick={handleSubmit}>
          Générer & simuler les droits
        </button>
      </form>
    </div>
  )
}
