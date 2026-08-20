// Fichier généré automatiquement
// Fichier généré automatiquement
import React, { forwardRef } from 'react'
import styles from '../styles/ProductForm.module.css'

const VehicleForm = forwardRef(
  (
    {
      vehicles,
      onUpdate,
      onAdd,
      onRemove,
      shipping,
      onShippingUpdate,
      totals,
      onSubmit,
      loading,
    },
    ref,
  ) => {
    // ✅ Validation des champs avant soumission
    const validateVehicle = (vehicle) => {
      const errors = []

      if (!vehicle.type || !['Neuf', 'Occasion'].includes(vehicle.type)) {
        errors.push('Type invalide (Neuf ou Occasion)')
      }

      if (
        !vehicle.marque ||
        vehicle.marque.trim().length < 2 ||
        vehicle.marque.length > 100
      ) {
        errors.push('La marque doit contenir entre 2 et 100 caractères')
      }

      if (vehicle.kilometrage !== undefined && vehicle.kilometrage !== null) {
        const km = parseInt(vehicle.kilometrage)
        if (isNaN(km) || km < 0 || km > 1000000) {
          errors.push('Le kilométrage doit être entre 0 et 1 000 000 km')
        }
      }

      if (
        vehicle.puissanceFiscal !== undefined &&
        vehicle.puissanceFiscal !== null
      ) {
        const cv = parseInt(vehicle.puissanceFiscal)
        if (isNaN(cv) || cv < 1 || cv > 50) {
          errors.push('La puissance fiscale doit être entre 1 et 50 CV')
        }
      }

      if (vehicle.anneeFabrication) {
        const year = parseInt(vehicle.anneeFabrication)
        const currentYear = new Date().getFullYear()
        if (isNaN(year) || year < 1900 || year > currentYear + 1) {
          errors.push(`L'année doit être entre 1900 et ${currentYear + 1}`)
        }
      }

      if (
        !vehicle.motorisation ||
        !['Essence', 'Diesel', 'Hybride', 'Electrique'].includes(
          vehicle.motorisation,
        )
      ) {
        errors.push(
          'Motorisation invalide (Essence, Diesel, Hybride, Electrique)',
        )
      }

      if (vehicle.longueurCm) {
        const length = parseInt(vehicle.longueurCm)
        if (isNaN(length) || length < 50 || length > 2000) {
          errors.push('La longueur doit être entre 50 et 2000 cm')
        }
      }

      if (vehicle.largeurCm) {
        const width = parseInt(vehicle.largeurCm)
        if (isNaN(width) || width < 50 || width > 2000) {
          errors.push('La largeur doit être entre 50 et 2000 cm')
        }
      }

      if (vehicle.hauteurCm) {
        const height = parseInt(vehicle.hauteurCm)
        if (isNaN(height) || height < 50 || height > 2000) {
          errors.push('La hauteur doit être entre 50 et 2000 cm')
        }
      }

      if (vehicle.poidsKg) {
        const weight = parseInt(vehicle.poidsKg)
        if (isNaN(weight) || weight < 100 || weight > 30000) {
          errors.push('Le poids doit être entre 100 et 30000 kg')
        }
      }

      if (vehicle.quantity) {
        const qty = parseInt(vehicle.quantity)
        if (isNaN(qty) || qty < 1 || qty > 100) {
          errors.push('La quantité doit être entre 1 et 100')
        }
      }

      if (vehicle.prix !== undefined && vehicle.prix !== null) {
        const price = parseFloat(vehicle.prix)
        if (isNaN(price) || price < 0) {
          errors.push('Le prix doit être un nombre positif')
        }
      }

      if (
        !vehicle.devise ||
        !['EUR', 'USD', 'CAD', 'CHF', 'GBP', 'XOF', 'XAF'].includes(
          vehicle.devise,
        )
      ) {
        errors.push('Devise invalide')
      }

      return errors
    }

    const handleSubmit = () => {
      let allValid = true
      let errorMessages = []

      vehicles.forEach((vehicle, index) => {
        const errors = validateVehicle(vehicle)
        if (errors.length > 0) {
          allValid = false
          errorMessages.push(`Véhicule ${index + 1}: ${errors.join(', ')}`)
        }
      })

      if (
        !shipping.devise ||
        !['EUR', 'USD', 'CAD', 'CHF', 'GBP', 'XOF', 'XAF'].includes(
          shipping.devise,
        )
      ) {
        allValid = false
        errorMessages.push('Devise de livraison invalide')
      }

      if (
        shipping.incoterm &&
        ![
          'EXW',
          'FOB',
          'CIF',
          'CFR',
          'CIP',
          'CPT',
          'DAP',
          'DPU',
          'DDP',
        ].includes(shipping.incoterm)
      ) {
        allValid = false
        errorMessages.push('Incoterm invalide')
      }

      if (!allValid) {
        alert(`⚠️ Erreurs de validation:\n\n${errorMessages.join('\n')}`)
        return
      }

      onSubmit()
    }

    return (
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>🚗 Gestion des véhicules</legend>

        <form ref={ref} className={styles.form}>
          {vehicles.map((vehicle, index) => {
            const errors = validateVehicle(vehicle)
            const hasError = errors.length > 0

            return (
              <div
                key={index}
                className={`${styles.vehicleCard} ${hasError ? styles.vehicleCardError : ''}`}
              >
                <div className={styles.vehicleHeader}>
                  <h4>Véhicule {index + 1}</h4>
                  {hasError && (
                    <span className={styles.errorBadge}>
                      ⚠️ {errors.length} erreur{errors.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className={styles.grid2}>
                  {/* ✅ Type - SANS "Sélectionner" */}
                  <div
                    className={`${styles.field} ${!vehicle.type || !['Neuf', 'Occasion'].includes(vehicle.type) ? styles.fieldError : ''}`}
                  >
                    <label>
                      Type * <span className={styles.required}>*</span>
                    </label>
                    <select
                      value={vehicle.type || 'Neuf'}
                      onChange={(e) => onUpdate(index, 'type', e.target.value)}
                      className={
                        vehicle.type &&
                        ['Neuf', 'Occasion'].includes(vehicle.type)
                          ? styles.valid
                          : ''
                      }
                    >
                      <option value='Neuf'>Neuf</option>
                      <option value='Occasion'>Occasion</option>
                    </select>
                  </div>

                  {/* Marque */}
                  <div
                    className={`${styles.field} ${!vehicle.marque || vehicle.marque.length < 2 ? styles.fieldError : ''}`}
                  >
                    <label>
                      Marque * <span className={styles.required}>*</span>
                    </label>
                    <input
                      type='text'
                      value={vehicle.marque || ''}
                      onChange={(e) =>
                        onUpdate(index, 'marque', e.target.value)
                      }
                      placeholder='Marque (2-100 caractères)'
                      maxLength={100}
                      className={
                        vehicle.marque && vehicle.marque.length >= 2
                          ? styles.valid
                          : ''
                      }
                    />
                  </div>
                </div>

                <div className={styles.grid2}>
                  {/* ✅ Année - SANS "Sélectionner" */}
                  <div
                    className={`${styles.field} ${!vehicle.anneeFabrication ? styles.fieldError : ''}`}
                  >
                    <label>
                      Année de fabrication *{' '}
                      <span className={styles.required}>*</span>
                    </label>
                    <select
                      value={
                        vehicle.anneeFabrication || new Date().getFullYear()
                      }
                      onChange={(e) =>
                        onUpdate(
                          index,
                          'anneeFabrication',
                          parseInt(e.target.value),
                        )
                      }
                      className={vehicle.anneeFabrication ? styles.valid : ''}
                    >
                      {Array.from(
                        { length: 30 },
                        (_, i) => new Date().getFullYear() - i,
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ✅ Motorisation - SANS "Sélectionner" */}
                  <div
                    className={`${styles.field} ${!vehicle.motorisation || !['Essence', 'Diesel', 'Hybride', 'Electrique'].includes(vehicle.motorisation) ? styles.fieldError : ''}`}
                  >
                    <label>
                      Motorisation * <span className={styles.required}>*</span>
                    </label>
                    <select
                      value={vehicle.motorisation || 'Essence'}
                      onChange={(e) =>
                        onUpdate(index, 'motorisation', e.target.value)
                      }
                      className={
                        vehicle.motorisation &&
                        ['Essence', 'Diesel', 'Hybride', 'Electrique'].includes(
                          vehicle.motorisation,
                        )
                          ? styles.valid
                          : ''
                      }
                    >
                      <option value='Essence'>Essence</option>
                      <option value='Diesel'>Diesel</option>
                      <option value='Hybride'>Hybride</option>
                      <option value='Electrique'>Electrique</option>
                    </select>
                  </div>
                </div>

                <div className={styles.grid3}>
                  <div className={styles.field}>
                    <label>Kilométrage (km)</label>
                    <input
                      type='number'
                      min='0'
                      max='1000000'
                      value={vehicle.kilometrage || ''}
                      onChange={(e) =>
                        onUpdate(index, 'kilometrage', e.target.value)
                      }
                      placeholder='0-1 000 000 km'
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Puissance fiscale (CV)</label>
                    <input
                      type='number'
                      min='1'
                      max='50'
                      value={vehicle.puissanceFiscal || ''}
                      onChange={(e) =>
                        onUpdate(index, 'puissanceFiscal', e.target.value)
                      }
                      placeholder='1-50 CV'
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Description</label>
                    <input
                      type='text'
                      value={vehicle.description || ''}
                      onChange={(e) =>
                        onUpdate(index, 'description', e.target.value)
                      }
                      placeholder='Description (optionnelle)'
                      maxLength={500}
                    />
                  </div>
                </div>

                <div className={styles.grid3}>
                  <div
                    className={`${styles.field} ${!vehicle.longueurCm ? styles.fieldError : ''}`}
                  >
                    <label>
                      Longueur (cm) * <span className={styles.required}>*</span>
                    </label>
                    <input
                      type='number'
                      min='50'
                      max='2000'
                      value={vehicle.longueurCm || ''}
                      onChange={(e) =>
                        onUpdate(index, 'longueurCm', e.target.value)
                      }
                      placeholder='50-2000 cm'
                      className={vehicle.longueurCm ? styles.valid : ''}
                    />
                  </div>

                  <div
                    className={`${styles.field} ${!vehicle.largeurCm ? styles.fieldError : ''}`}
                  >
                    <label>
                      Largeur (cm) * <span className={styles.required}>*</span>
                    </label>
                    <input
                      type='number'
                      min='50'
                      max='2000'
                      value={vehicle.largeurCm || ''}
                      onChange={(e) =>
                        onUpdate(index, 'largeurCm', e.target.value)
                      }
                      placeholder='50-2000 cm'
                      className={vehicle.largeurCm ? styles.valid : ''}
                    />
                  </div>

                  <div
                    className={`${styles.field} ${!vehicle.hauteurCm ? styles.fieldError : ''}`}
                  >
                    <label>
                      Hauteur (cm) * <span className={styles.required}>*</span>
                    </label>
                    <input
                      type='number'
                      min='50'
                      max='2000'
                      value={vehicle.hauteurCm || ''}
                      onChange={(e) =>
                        onUpdate(index, 'hauteurCm', e.target.value)
                      }
                      placeholder='50-2000 cm'
                      className={vehicle.hauteurCm ? styles.valid : ''}
                    />
                  </div>
                </div>

                <div className={styles.grid3}>
                  <div
                    className={`${styles.field} ${!vehicle.poidsKg ? styles.fieldError : ''}`}
                  >
                    <label>
                      Poids (kg) * <span className={styles.required}>*</span>
                    </label>
                    <input
                      type='number'
                      min='100'
                      max='30000'
                      value={vehicle.poidsKg || ''}
                      onChange={(e) =>
                        onUpdate(index, 'poidsKg', e.target.value)
                      }
                      placeholder='100-30000 kg'
                      className={vehicle.poidsKg ? styles.valid : ''}
                    />
                  </div>

                  <div
                    className={`${styles.field} ${!vehicle.quantity ? styles.fieldError : ''}`}
                  >
                    <label>
                      Quantité * <span className={styles.required}>*</span>
                    </label>
                    <input
                      type='number'
                      min='1'
                      max='100'
                      value={vehicle.quantity || ''}
                      onChange={(e) =>
                        onUpdate(index, 'quantity', e.target.value)
                      }
                      placeholder='1-100'
                      className={vehicle.quantity ? styles.valid : ''}
                    />
                  </div>

                  <div
                    className={`${styles.field} ${vehicle.prix === undefined || vehicle.prix === null || vehicle.prix < 0 ? styles.fieldError : ''}`}
                  >
                    <label>
                      Prix d'achat * <span className={styles.required}>*</span>
                    </label>
                    <input
                      type='number'
                      step='0.01'
                      min='0'
                      value={vehicle.prix || ''}
                      onChange={(e) => onUpdate(index, 'prix', e.target.value)}
                      placeholder="Prix d'achat"
                      className={
                        vehicle.prix && vehicle.prix >= 0 ? styles.valid : ''
                      }
                    />
                  </div>
                </div>

                <div className={styles.grid2}>
                  <div className={styles.field}>
                    <label>Prix total</label>
                    <input
                      type='number'
                      value={vehicle.prixTotal || 0}
                      readOnly
                      className={styles.readonly}
                    />
                  </div>

                  {/* ✅ Devise - SANS "Sélectionner" */}
                  <div
                    className={`${styles.field} ${!vehicle.devise || !['EUR', 'USD', 'CAD', 'CHF', 'GBP', 'XOF', 'XAF'].includes(vehicle.devise) ? styles.fieldError : ''}`}
                  >
                    <label>
                      Devise * <span className={styles.required}>*</span>
                    </label>
                    <select
                      value={vehicle.devise || 'EUR'}
                      onChange={(e) =>
                        onUpdate(index, 'devise', e.target.value)
                      }
                      className={vehicle.devise ? styles.valid : ''}
                    >
                      <option value='EUR'>EUR (€)</option>
                      <option value='USD'>USD ($)</option>
                      <option value='CAD'>CAD ($)</option>
                      <option value='CHF'>CHF (Fr)</option>
                      <option value='GBP'>GBP (£)</option>
                      <option value='XOF'>XOF (CFA)</option>
                      <option value='XAF'>XAF (CFA)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Photo du véhicule</label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) =>
                      onUpdate(index, 'photo', e.target.files[0])
                    }
                    className={styles.fileInput}
                  />
                  <span className={styles.fieldHint}>
                    Format: PNG, JPG (max 2MB)
                  </span>
                </div>

                <button
                  type='button'
                  className={styles.deleteBtn}
                  onClick={() => onRemove(index)}
                  disabled={vehicles.length === 1}
                >
                  🗑️ Supprimer ce véhicule
                </button>
              </div>
            )
          })}

          <div className={styles.btnContainer}>
            <button type='button' className={styles.addBtn} onClick={onAdd}>
              ➕ Ajouter un véhicule
            </button>
          </div>

          {/* Shipping Section */}
          <div className={styles.section}>
            <h3>🚢 Fret maritime</h3>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Prix Fret maritime</label>
                <input
                  type='number'
                  step='0.01'
                  min='0'
                  value={shipping.oceanFreight || 0}
                  onChange={(e) =>
                    onShippingUpdate(
                      'oceanFreight',
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  placeholder='Fret maritime'
                />
              </div>

              <div className={styles.field}>
                <label>Assurance</label>
                <input
                  type='number'
                  step='0.01'
                  min='0'
                  value={shipping.insurance || 0}
                  onChange={(e) =>
                    onShippingUpdate(
                      'insurance',
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  placeholder='Assurance'
                />
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Total FOB</label>
                <input
                  type='number'
                  value={totals.fob || 0}
                  readOnly
                  className={styles.readonly}
                />
              </div>
              <div className={styles.field}>
                <label>Total CIF</label>
                <input
                  type='number'
                  value={totals.total || 0}
                  readOnly
                  className={styles.readonly}
                />
              </div>
            </div>

            <div className={styles.grid2}>
              {/* ✅ Devise shipping - SANS "Sélectionner" */}
              <div className={styles.field}>
                <label>Devise *</label>
                <select
                  value={shipping.devise || 'EUR'}
                  onChange={(e) => onShippingUpdate('devise', e.target.value)}
                >
                  <option value='EUR'>EUR (€)</option>
                  <option value='USD'>USD ($)</option>
                  <option value='CAD'>CAD ($)</option>
                  <option value='CHF'>CHF (Fr)</option>
                  <option value='GBP'>GBP (£)</option>
                  <option value='XOF'>XOF (CFA)</option>
                  <option value='XAF'>XAF (CFA)</option>
                </select>
              </div>

              {/* ✅ Incoterm - SANS "Sélectionner" */}
              <div className={styles.field}>
                <label>Incoterm</label>
                <select
                  value={shipping.incoterm || 'EXW'}
                  onChange={(e) => onShippingUpdate('incoterm', e.target.value)}
                >
                  <option value='EXW'>EXW</option>
                  <option value='FOB'>FOB</option>
                  <option value='CIF'>CIF</option>
                  <option value='CFR'>CFR</option>
                  <option value='CIP'>CIP</option>
                  <option value='CPT'>CPT</option>
                  <option value='DAP'>DAP</option>
                  <option value='DPU'>DPU</option>
                  <option value='DDP'>DDP</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type='button'
              className={styles.primaryBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? '⏳ Génération en cours...'
                : '📄 Générer & simuler les droits de douane'}
            </button>
          </div>
        </form>
      </fieldset>
    )
  },
)

VehicleForm.displayName = 'VehicleForm'

export default VehicleForm
