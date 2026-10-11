import React, { forwardRef, useEffect, useRef, useState } from 'react'
import styles from '../styles/VehicleForm.module.css'

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
    // =========================================================
    // REFS
    // =========================================================

    // Réservé aux input[type="file"]
    const fileRefs = useRef([])

    // Refs des champs pour focus automatique sur la première erreur
    const fieldRefs = useRef({})

    // =========================================================
    // STATES
    // =========================================================

    const [submitted, setSubmitted] = useState(false)

    /*
     * touched[index][field] = true
     *
     * Permet de ne pas afficher les erreurs immédiatement.
     */
    const [touched, setTouched] = useState({})

    /*
     * Erreurs de validation :
     *
     * {
     *   0: {
     *     marque: 'La marque est obligatoire',
     *     prix: 'Le prix est obligatoire'
     *   }
     * }
     */
    const [fieldErrors, setFieldErrors] = useState({})

    // =========================================================
    // CONSTANTES
    // =========================================================

    const CURRENT_YEAR = new Date().getFullYear()

    const VALID_TYPES = ['Neuf', 'Occasion']

    const VALID_MOTORIZATIONS = ['Essence', 'Diesel', 'Hybride', 'Electrique']

    const VALID_CURRENCIES = ['EUR', 'USD', 'CAD', 'CHF', 'GBP', 'XOF', 'XAF']

    const VALID_INCOTERMS = ['EXW', 'FOB', 'CIF', 'CFR']

    const years = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i)

    // =========================================================
    // HELPERS
    // =========================================================

    const setFieldRef = (key, element) => {
      if (element) {
        fieldRefs.current[key] = element
      }
    }

    const getFieldValue = (vehicle, field) => {
      return String(vehicle?.[field] ?? '').trim()
    }

    const isValidCurrency = (value) => {
      return VALID_CURRENCIES.includes(value)
    }

    const isValidIncoterm = (value) => {
      return !value || VALID_INCOTERMS.includes(value)
    }

    // =========================================================
    // VALIDATION D'UN CHAMP
    // =========================================================

    const validateField = (vehicle, field) => {
      if (!vehicle) {
        return ''
      }

      switch (field) {
        case 'type': {
          if (!VALID_TYPES.includes(vehicle.type)) {
            return 'Veuillez sélectionner le type du véhicule.'
          }

          return ''
        }

        case 'marque': {
          const value = getFieldValue(vehicle, 'marque')

          if (!value) {
            return 'La marque est obligatoire.'
          }

          if (value.length < 2) {
            return 'La marque doit contenir au moins 2 caractères.'
          }

          if (value.length > 100) {
            return 'La marque ne peut pas dépasser 100 caractères.'
          }

          return ''
        }

        case 'kilometrage': {
          const value = getFieldValue(vehicle, 'kilometrage')

          if (!value) {
            return 'Le kilométrage est obligatoire.'
          }

          const km = Number(value)

          if (!Number.isInteger(km)) {
            return 'Le kilométrage doit être un nombre entier.'
          }

          if (km < 0 || km > 1000000) {
            return 'Le kilométrage doit être compris entre 0 et 1 000 000 km.'
          }

          return ''
        }

        case 'puissanceFiscal': {
          const value = getFieldValue(vehicle, 'puissanceFiscal')

          if (!value) {
            return 'La puissance fiscale est obligatoire.'
          }

          const cv = Number(value)

          if (Number.isNaN(cv)) {
            return 'La puissance fiscale doit être un nombre.'
          }

          if (cv < 1 || cv > 50) {
            return 'La puissance fiscale doit être comprise entre 1 et 50 CV.'
          }

          return ''
        }

        case 'anneeFabrication': {
          const value = getFieldValue(vehicle, 'anneeFabrication')

          if (!value) {
            return "L'année de fabrication est obligatoire."
          }

          const year = Number(value)

          if (!Number.isInteger(year)) {
            return "L'année doit être un nombre entier."
          }

          if (year < 1900 || year > CURRENT_YEAR + 1) {
            return `L'année doit être comprise entre 1900 et ${
              CURRENT_YEAR + 1
            }.`
          }

          return ''
        }

        case 'motorisation': {
          if (!VALID_MOTORIZATIONS.includes(vehicle.motorisation)) {
            return 'Veuillez sélectionner une motorisation.'
          }

          return ''
        }

        case 'longueurCm': {
          const value = getFieldValue(vehicle, 'longueurCm')

          if (!value) {
            return 'La longueur est obligatoire.'
          }

          const length = Number(value)

          if (!Number.isInteger(length)) {
            return 'La longueur doit être un nombre entier.'
          }

          if (length < 50 || length > 2000) {
            return 'La longueur doit être comprise entre 50 et 2000 cm.'
          }

          return ''
        }

        case 'largeurCm': {
          const value = getFieldValue(vehicle, 'largeurCm')

          if (!value) {
            return 'La largeur est obligatoire.'
          }

          const width = Number(value)

          if (!Number.isInteger(width)) {
            return 'La largeur doit être un nombre entier.'
          }

          if (width < 50 || width > 2000) {
            return 'La largeur doit être comprise entre 50 et 2000 cm.'
          }

          return ''
        }

        case 'hauteurCm': {
          const value = getFieldValue(vehicle, 'hauteurCm')

          if (!value) {
            return 'La hauteur est obligatoire.'
          }

          const height = Number(value)

          if (!Number.isInteger(height)) {
            return 'La hauteur doit être un nombre entier.'
          }

          if (height < 50 || height > 2000) {
            return 'La hauteur doit être comprise entre 50 et 2000 cm.'
          }

          return ''
        }

        case 'poidsKg': {
          const value = getFieldValue(vehicle, 'poidsKg')

          if (!value) {
            return 'Le poids est obligatoire.'
          }

          const weight = Number(value)

          if (!Number.isInteger(weight)) {
            return 'Le poids doit être un nombre entier.'
          }

          if (weight < 100 || weight > 30000) {
            return 'Le poids doit être compris entre 100 et 30 000 kg.'
          }

          return ''
        }

        case 'quantity': {
          const value = getFieldValue(vehicle, 'quantity')

          if (!value) {
            return 'La quantité est obligatoire.'
          }

          const quantity = Number(value)

          if (!Number.isInteger(quantity)) {
            return 'La quantité doit être un nombre entier.'
          }

          if (quantity < 1 || quantity > 100) {
            return 'La quantité doit être comprise entre 1 et 100.'
          }

          return ''
        }

        case 'prix': {
          const value = getFieldValue(vehicle, 'prix')

          if (!value) {
            return "Le prix d'achat est obligatoire."
          }

          const price = Number(value)

          if (Number.isNaN(price)) {
            return 'Le prix doit être un nombre valide.'
          }

          if (price < 0) {
            return 'Le prix ne peut pas être négatif.'
          }

          return ''
        }

        case 'devise': {
          if (!isValidCurrency(vehicle.devise)) {
            return 'Veuillez sélectionner une devise.'
          }

          return ''
        }

        case 'photo': {
          if (!vehicle.photo) {
            return 'La photo du véhicule est obligatoire.'
          }

          const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']

          if (
            vehicle.photo.type &&
            !allowedTypes.includes(vehicle.photo.type)
          ) {
            return 'Format invalide. Utilisez uniquement PNG ou JPG.'
          }

          const maxSize = 2 * 1024 * 1024

          if (vehicle.photo.size && vehicle.photo.size > maxSize) {
            return 'La photo ne doit pas dépasser 2 MB.'
          }

          return ''
        }

        default:
          return ''
      }
    }

    // =========================================================
    // VALIDATION COMPLETE D'UN VÉHICULE
    // =========================================================

    const validateVehicle = (vehicle) => {
      const fields = [
        'type',
        'marque',
        'kilometrage',
        'puissanceFiscal',
        'anneeFabrication',
        'motorisation',
        'longueurCm',
        'largeurCm',
        'hauteurCm',
        'poidsKg',
        'quantity',
        'prix',
        'devise',
        'photo',
      ]

      const errors = {}

      fields.forEach((field) => {
        const error = validateField(vehicle, field)

        if (error) {
          errors[field] = error
        }
      })

      return errors
    }

    // =========================================================
    // SHIPPING VALIDATION
    // =========================================================

    const validateShipping = () => {
      const errors = {}

      if (!isValidCurrency(shipping?.devise)) {
        errors.devise = 'Veuillez sélectionner une devise pour le transport.'
      }

      if (!isValidIncoterm(shipping?.incoterm)) {
        errors.incoterm = 'Incoterm invalide.'
      }

      return errors
    }

    // =========================================================
    // TOUCHED
    // =========================================================

    const markTouched = (index, field) => {
      setTouched((previous) => ({
        ...previous,
        [index]: {
          ...(previous[index] || {}),
          [field]: true,
        },
      }))

      const error = validateField(vehicles[index], field)

      setFieldErrors((previous) => ({
        ...previous,
        [index]: {
          ...(previous[index] || {}),
          ...(error ? { [field]: error } : { [field]: undefined }),
        },
      }))
    }

    // =========================================================
    // VALIDATION APRÈS MODIFICATION
    // =========================================================

    useEffect(() => {
      if (!submitted) {
        return
      }

      const newErrors = {}

      vehicles.forEach((vehicle, index) => {
        const errors = validateVehicle(vehicle)

        if (Object.keys(errors).length > 0) {
          newErrors[index] = errors
        }
      })

      setFieldErrors(newErrors)
    }, [vehicles, submitted])

    // =========================================================
    // HANDLE CHANGE
    // =========================================================
    /**
     * handleFieldChange(0, 'devise', 'EUR')
     * index = 0 → produit 1
     * field = 'devise'
     * value = 'EUR'
     * 
     * AVDSimulator
            ↓
          VehicleForm
            ↓
          handleFieldChange()
            ↓
          onUpdate()
            ↓
          updateVehicle()
            ↓
          useList(VehicleManager)

      * 1) updateVehicle est une fonction retournée par ton hook useList.
      * 2) Tu la passes à VehicleForm -> onUpdate === updateVehicle
      * 3) Quand l'utilisateur modifie un champ : handleFieldChange(0, 'devise', 'EUR') devient en réalité : updateVehicle(0, 'devise', 'EUR');
      * 4) Le vrai travail est fait dans updateVehicle
     */
    const handleFieldChange = (index, field, value) => {
      onUpdate(index, field, value)

      // Si la devise du produit 1 change
      if (index === 0 && field === 'devise') {
        // Mise à jour des autres véhicules
        vehicles.forEach((_, i) => {
          if (i !== 0) {
            onUpdate(i, 'devise', value)
          }
        })

        // Mise à jour du shipping
        onShippingUpdate('devise', value)
      }

      /*
       * Si le champ avait déjà été touché,
       * on le revalide immédiatement.
       */
      if (touched[index]?.[field]) {
        const vehicle = {
          ...vehicles[index],
          [field]: value,
        }

        const error = validateField(vehicle, field)

        setFieldErrors((previous) => ({
          ...previous,
          [index]: {
            ...(previous[index] || {}),
            ...(error ? { [field]: error } : { [field]: undefined }),
          },
        }))
      }
    }

    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = (event) => {
      event?.preventDefault()

      setSubmitted(true)

      const newErrors = {}

      vehicles.forEach((vehicle, index) => {
        const errors = validateVehicle(vehicle)

        if (Object.keys(errors).length > 0) {
          newErrors[index] = errors
        }
      })

      const shippingErrors = validateShipping()

      setFieldErrors(newErrors)

      const hasVehicleErrors = Object.keys(newErrors).length > 0

      const hasShippingErrors = Object.keys(shippingErrors).length > 0

      if (hasVehicleErrors || hasShippingErrors) {
        /*
         * Marquer tous les champs véhicule comme touchés
         * pour afficher les erreurs.
         */
        const allTouched = {}

        vehicles.forEach((vehicle, index) => {
          allTouched[index] = {
            type: true,
            marque: true,
            kilometrage: true,
            puissanceFiscal: true,
            anneeFabrication: true,
            motorisation: true,
            longueurCm: true,
            largeurCm: true,
            hauteurCm: true,
            poidsKg: true,
            quantity: true,
            prix: true,
            devise: true,
            photo: true,
          }
        })

        setTouched(allTouched)

        /*
         * Focus automatique sur le premier champ invalide.
         */
        const firstVehicleIndex = Object.keys(newErrors)[0]

        if (firstVehicleIndex !== undefined) {
          const firstField = Object.keys(newErrors[firstVehicleIndex])[0]

          const firstRef =
            fieldRefs.current[`${firstVehicleIndex}-${firstField}`]

          if (firstRef) {
            setTimeout(() => {
              firstRef.focus?.()
            }, 50)
          }
        }

        return
      }

      onSubmit()
    }

    // =========================================================
    // ERROR HELPERS
    // =========================================================

    const getError = (index, field) => {
      return fieldErrors[index]?.[field]
    }

    const shouldShowError = (index, field) => {
      return (
        Boolean(getError(index, field)) &&
        Boolean(submitted || touched[index]?.[field])
      )
    }

    const getFieldClass = (index, field) => {
      if (shouldShowError(index, field)) {
        return 'error'
      }

      if (touched[index]?.[field] && !getError(index, field)) {
        return 'valid'
      }

      return ''
    }

    // =========================================================
    // FIELD COMPONENT
    // =========================================================

    const FieldError = ({ index, field }) => {
      if (!shouldShowError(index, field)) {
        return null
      }

      return (
        <span className={styles.fieldErrorMessage} role='alert'>
          {getError(index, field)}
        </span>
      )
    }

    // =========================================================
    // RENDER
    // =========================================================

    const totalErrorCount = Object.values(fieldErrors).reduce(
      (total, errors) => total + Object.keys(errors || {}).length,
      0,
    )

    return (
      <fieldset className={styles.vehicleForm}>
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className={styles.formHeader}>
          <div className={styles.formHeaderIcon}>🚗</div>
          <div>
            <h2>Simulateur des véhicules</h2>
            <p>
              Renseignez les caractéristiques de vos véhicules pour calculer les
              droits de douane.
            </p>
          </div>
        </div>

        {/* =====================================================
            GLOBAL ERROR SUMMARY
        ====================================================== */}

        {submitted && totalErrorCount > 0 && (
          <div className='formErrorSummary' role='alert'>
            <div className='formErrorSummaryTitle'>
              <span>⚠️</span>

              <strong>Vérifiez les informations saisies</strong>
            </div>

            <p>
              {totalErrorCount === 1
                ? 'Un champ nécessite votre attention.'
                : `${totalErrorCount} champs nécessitent votre attention.`}
            </p>

            {Object.entries(fieldErrors).map(([index, errors]) => (
              <div key={index} className='vehicleErrorSummary'>
                <strong>Véhicule {Number(index) + 1}</strong>

                <ul>
                  {Object.values(errors).map((error, errorIndex) => (
                    <li key={errorIndex}>{error}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <form
          ref={ref}
          className='formContent'
          onSubmit={handleSubmit}
          noValidate
        >
          {/* ===================================================
              VEHICLES
          ==================================================== */}

          {vehicles.map((vehicle, index) => {
            const errors = fieldErrors[index] || {}

            const vehicleHasError = submitted && Object.keys(errors).length > 0

            return (
              <div
                key={index}
                className={`${styles.vehicleCard} ${
                  vehicleHasError ? styles.vehicleCardError : ''
                }`}
              >
                {/* =============================================
                    VEHICLE HEADER
                ============================================== */}

                <div className={styles.vehicleCardHeader}>
                  <div className={styles.vehicleTitle}>
                    <div className={styles.vehicleNumber}>{index + 1}</div>

                    <div>
                      <h3>Véhicule {index + 1}</h3>

                      <p>
                        Informations générales et caractéristiques techniques
                      </p>
                    </div>
                  </div>

                  {vehicleHasError && (
                    <span className={styles.errorBadge}>
                      ⚠️ {Object.keys(errors).length} erreur
                      {Object.keys(errors).length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* =============================================
                    INFORMATIONS GÉNÉRALES
                ============================================== */}

                <section className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionIcon}>🚘</div>

                    <div>
                      <h4>Informations générales</h4>

                      <p>Identifiez le véhicule</p>
                    </div>
                  </div>

                  <div className={styles.grid2}>
                    {/* TYPE */}

                    <div className={styles.field}>
                      <label htmlFor={`type-${index}`}>
                        Type <span className={styles.required}>*</span>
                      </label>

                      <select
                        id={`type-${index}`}
                        ref={(element) => setFieldRef(`${index}-type`, element)}
                        value={vehicle.type || ''}
                        onChange={(e) =>
                          handleFieldChange(index, 'type', e.target.value)
                        }
                        onBlur={() => markTouched(index, 'type')}
                        className={`${styles.input} ${getFieldClass(index, 'type')}`}
                      >
                        <option value='' disabled>
                          Sélectionner le type
                        </option>

                        <option value='Neuf'>Neuf</option>

                        <option value='Occasion'>Occasion</option>
                      </select>

                      <FieldError index={index} field='type' />
                    </div>

                    {/* MARQUE */}

                    <div className={styles.field}>
                      <label htmlFor={`marque-${index}`}>
                        Marque <span className={styles.required}>*</span>
                      </label>

                      <input
                        id={`marque-${index}`}
                        ref={(element) =>
                          setFieldRef(`${index}-marque`, element)
                        }
                        type='text'
                        value={vehicle.marque || ''}
                        onChange={(e) =>
                          handleFieldChange(index, 'marque', e.target.value)
                        }
                        onBlur={() => markTouched(index, 'marque')}
                        placeholder='Ex. Mercedes-Benz'
                        maxLength={100}
                        className={`${styles.input} ${getFieldClass(index, 'marque')}`}
                      />

                      <span className={styles.fieldHint}>
                        2 à 100 caractères
                      </span>

                      <FieldError index={index} field='marque' />
                    </div>

                    {/* ANNÉE */}

                    <div className={styles.field}>
                      <label htmlFor={`annee-${index}`}>
                        Année de fabrication{' '}
                        <span className={styles.required}>*</span>
                      </label>

                      <select
                        id={`annee-${index}`}
                        ref={(element) =>
                          setFieldRef(`${index}-anneeFabrication`, element)
                        }
                        value={vehicle.anneeFabrication || ''}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            'anneeFabrication',
                            Number(e.target.value),
                          )
                        }
                        onBlur={() => markTouched(index, 'anneeFabrication')}
                        className={`${styles.input} ${getFieldClass(
                          index,
                          'anneeFabrication',
                        )}`}
                      >
                        <option value='' disabled>
                          Sélectionner l'année
                        </option>

                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>

                      <FieldError index={index} field='anneeFabrication' />
                    </div>

                    {/* MOTORISATION */}

                    <div className={styles.field}>
                      <label htmlFor={`motorisation-${index}`}>
                        Motorisation <span className={styles.required}>*</span>
                      </label>

                      <select
                        id={`motorisation-${index}`}
                        ref={(element) =>
                          setFieldRef(`${index}-motorisation`, element)
                        }
                        value={vehicle.motorisation || ''}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            'motorisation',
                            e.target.value,
                          )
                        }
                        onBlur={() => markTouched(index, 'motorisation')}
                        className={`${styles.input} ${getFieldClass(
                          index,
                          'motorisation',
                        )}`}
                      >
                        <option value='' disabled>
                          Sélectionner
                        </option>

                        <option value='Essence'>Essence</option>

                        <option value='Diesel'>Diesel</option>

                        <option value='Hybride'>Hybride</option>

                        <option value='Electrique'>Électrique</option>
                      </select>

                      <FieldError index={index} field='motorisation' />
                    </div>
                  </div>
                </section>

                {/* =============================================
                    CARACTÉRISTIQUES
                ============================================== */}
                <section className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionIcon}>⚙️</div>
                    <div>
                      <h4>Caractéristiques techniques</h4>
                      <p>Dimensions, poids et performances</p>
                    </div>
                  </div>

                  <div className={styles.grid3}>
                    {/* KILOMÉTRAGE */}

                    <div className={styles.field}>
                      <label htmlFor={`kilometrage-${index}`}>
                        Kilométrage <span className={styles.required}>*</span>
                      </label>

                      <div className={styles.inputWithUnit}>
                        <input
                          id={`kilometrage-${index}`}
                          ref={(element) =>
                            setFieldRef(`${index}-kilometrage`, element)
                          }
                          type='number'
                          min='0'
                          max='1000000'
                          step='1'
                          value={vehicle.kilometrage ?? ''}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              'kilometrage',
                              e.target.value,
                            )
                          }
                          onBlur={() => markTouched(index, 'kilometrage')}
                          placeholder='45 000'
                          className={`{${styles.input}} ${getFieldClass(
                            index,
                            'kilometrage',
                          )}`}
                        />

                        <span className={styles.unit}>km</span>
                      </div>

                      <FieldError index={index} field='kilometrage' />
                    </div>

                    {/* PUISSANCE */}

                    <div className={styles.field}>
                      <label htmlFor={`puissance-${index}`}>
                        Puissance fiscale{' '}
                        <span className={styles.required}>*</span>
                      </label>

                      <div className={styles.inputWithUnit}>
                        <input
                          id={`puissance-${index}`}
                          ref={(element) =>
                            setFieldRef(`${index}-puissanceFiscal`, element)
                          }
                          type='number'
                          min='1'
                          max='50'
                          step='0.1'
                          value={vehicle.puissanceFiscal ?? ''}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              'puissanceFiscal',
                              e.target.value,
                            )
                          }
                          onBlur={() => markTouched(index, 'puissanceFiscal')}
                          placeholder='7'
                          className={`${styles.input} ${getFieldClass(
                            index,
                            'puissanceFiscal',
                          )}`}
                        />

                        <span className={styles.unit}>CV</span>
                      </div>

                      <FieldError index={index} field='puissanceFiscal' />
                    </div>

                    {/* DESCRIPTION */}

                    <div className={styles.field}>
                      <label htmlFor={`description-${index}`}>
                        Description
                      </label>

                      <input
                        id={`description-${index}`}
                        type='text'
                        value={vehicle.description || ''}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            'description',
                            e.target.value,
                          )
                        }
                        placeholder='Description optionnelle'
                        maxLength={500}
                        className='input'
                      />

                      <span className={styles.fieldHint}>
                        Optionnel · 500 caractères maximum
                      </span>
                    </div>
                  </div>

                  {/* DIMENSIONS */}

                  <div className={styles.subSectionTitle}>
                    Dimensions du véhicule
                  </div>

                  <div className={styles.grid3}>
                    {/* LONGUEUR */}

                    <div className={styles.field}>
                      <label htmlFor={`longueur-${index}`}>
                        Longueur <span className='required'>*</span>
                      </label>

                      <div className={styles.inputWithUnit}>
                        <input
                          id={`longueur-${index}`}
                          ref={(element) =>
                            setFieldRef(`${index}-longueurCm`, element)
                          }
                          type='number'
                          min='50'
                          max='2000'
                          step='1'
                          value={vehicle.longueurCm ?? ''}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              'longueurCm',
                              e.target.value,
                            )
                          }
                          onBlur={() => markTouched(index, 'longueurCm')}
                          placeholder='450'
                          className={`${styles.input} ${getFieldClass(
                            index,
                            'longueurCm',
                          )}`}
                        />

                        <span className={styles.unit}>cm</span>
                      </div>

                      <FieldError index={index} field='longueurCm' />
                    </div>

                    {/* LARGEUR */}

                    <div className={styles.field}>
                      <label htmlFor={`largeur-${index}`}>
                        Largeur <span className={styles.required}>*</span>
                      </label>

                      <div className={styles.inputWithUnit}>
                        <input
                          id={`largeur-${index}`}
                          ref={(element) =>
                            setFieldRef(`${index}-largeurCm`, element)
                          }
                          type='number'
                          min='50'
                          max='2000'
                          step='1'
                          value={vehicle.largeurCm ?? ''}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              'largeurCm',
                              e.target.value,
                            )
                          }
                          onBlur={() => markTouched(index, 'largeurCm')}
                          placeholder='185'
                          className={`${styles.input} ${getFieldClass(
                            index,
                            'largeurCm',
                          )}`}
                        />

                        <span className={styles.unit}>cm</span>
                      </div>

                      <FieldError index={index} field='largeurCm' />
                    </div>

                    {/* HAUTEUR */}

                    <div className={styles.field}>
                      <label htmlFor={`hauteur-${index}`}>
                        Hauteur <span className='required'>*</span>
                      </label>

                      <div className={styles.inputWithUnit}>
                        <input
                          id={`hauteur-${index}`}
                          ref={(element) =>
                            setFieldRef(`${index}-hauteurCm`, element)
                          }
                          type='number'
                          min='50'
                          max='2000'
                          step='1'
                          value={vehicle.hauteurCm ?? ''}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              'hauteurCm',
                              e.target.value,
                            )
                          }
                          onBlur={() => markTouched(index, 'hauteurCm')}
                          placeholder='150'
                          className={`${styles.input} ${getFieldClass(
                            index,
                            'hauteurCm',
                          )}`}
                        />

                        <span className={styles.unit}>cm</span>
                      </div>

                      <FieldError index={index} field='hauteurCm' />
                    </div>
                  </div>

                  <div className={styles.grid3}>
                    {/* POIDS */}

                    <div className={styles.field}>
                      <label htmlFor={`poids-${index}`}>
                        Poids <span className={styles.required}>*</span>
                      </label>

                      <div className={styles.inputWithUnit}>
                        <input
                          id={`poids-${index}`}
                          ref={(element) =>
                            setFieldRef(`${index}-poidsKg`, element)
                          }
                          type='number'
                          min='100'
                          max='30000'
                          step='1'
                          value={vehicle.poidsKg ?? ''}
                          onChange={(e) =>
                            handleFieldChange(index, 'poidsKg', e.target.value)
                          }
                          onBlur={() => markTouched(index, 'poidsKg')}
                          placeholder='1 850'
                          className={`${styles.input} ${getFieldClass(index, 'poidsKg')}`}
                        />

                        <span className={styles.unit}>kg</span>
                      </div>

                      <FieldError index={index} field='poidsKg' />
                    </div>

                    {/* QUANTITÉ */}

                    <div className={styles.field}>
                      <label htmlFor={`quantity-${index}`}>
                        Quantité <span className={styles.required}>*</span>
                      </label>

                      <input
                        id={`quantity-${index}`}
                        ref={(element) =>
                          setFieldRef(`${index}-quantity`, element)
                        }
                        type='number'
                        min='1'
                        max='100'
                        step='1'
                        value={vehicle.quantity ?? ''}
                        onChange={(e) =>
                          handleFieldChange(index, 'quantity', e.target.value)
                        }
                        onBlur={() => markTouched(index, 'quantity')}
                        placeholder='1'
                        className={`${styles.input} ${getFieldClass(index, 'quantity')}`}
                      />

                      <FieldError index={index} field='quantity' />
                    </div>

                    <div className={styles.field} />
                  </div>
                </section>

                {/* =============================================
                    PRIX
                ============================================== */}

                <section className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionIcon}>💰</div>

                    <div>
                      <h4>Prix et devise</h4>
                      <p>Informations financières du véhicule</p>
                    </div>
                  </div>

                  <div className={styles.grid3}>
                    {/* PRIX */}

                    <div className={styles.field}>
                      <label htmlFor={`prix-${index}`}>
                        Prix d'achat <span className={styles.required}>*</span>
                      </label>

                      <input
                        id={`prix-${index}`}
                        ref={(element) => setFieldRef(`${index}-prix`, element)}
                        type='number'
                        min='0'
                        step='0.01'
                        value={vehicle.prix ?? ''}
                        onChange={(e) =>
                          handleFieldChange(index, 'prix', e.target.value)
                        }
                        onBlur={() => markTouched(index, 'prix')}
                        placeholder='25 000'
                        className={`${styles.input} ${getFieldClass(index, 'prix')}`}
                      />

                      <FieldError index={index} field='prix' />
                    </div>

                    {/* DEVISE */}
                    <div className={styles.field}>
                      <label htmlFor={`devise-${index}`}>
                        Devise <span className={styles.required}>*</span>
                      </label>
                      <select
                        id={`devise-${index}`}
                        ref={(element) =>
                          setFieldRef(`${index}-devise`, element)
                        }
                        value={vehicle.devise || ''}
                        onChange={(e) =>
                          handleFieldChange(index, 'devise', e.target.value)
                        }
                        onBlur={() => markTouched(index, 'devise')}
                        className={`${styles.input} ${getFieldClass(index, 'devise')}`}
                      >
                        <option value='' disabled>
                          Sélectionner une devise
                        </option>
                        <option value='EUR'>EUR (€)</option>
                        <option value='USD'>USD ($)</option>
                        <option value='CAD'>CAD ($)</option>
                        <option value='CHF'>CHF (Fr)</option>
                        <option value='GBP'>GBP (£)</option>
                        <option value='XOF'>XOF (FCFA)</option>
                        <option value='XAF'>XAF (FCFA)</option>
                      </select>
                      <FieldError index={index} field='devise' />
                    </div>

                    {/* PRIX TOTAL */}

                    <div className={styles.field}>
                      <label>Prix total</label>

                      <input
                        type='number'
                        value={vehicle.prixTotal || 0}
                        readOnly
                        className={`${styles.input} ${styles.readonly}`}
                      />

                      <span className={styles.fieldHint}>
                        Calculé automatiquement
                      </span>
                    </div>
                  </div>
                </section>

                {/* =============================================
                    PHOTO
                ============================================== */}

                <section className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionIcon}>📷</div>

                    <div>
                      <h4>Photo du véhicule</h4>
                      <p>Ajoutez une photo représentative du véhicule</p>
                    </div>
                  </div>

                  <div className={styles.photoUpload}>
                    <input
                      id={`photo-${index}`}
                      ref={(element) => {
                        fileRefs.current[index] = element

                        setFieldRef(`${index}-photo`, element)
                      }}
                      type='file'
                      accept='image/png,image/jpeg,image/jpg'
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null

                        handleFieldChange(index, 'photo', file)
                      }}
                      onBlur={() => markTouched(index, 'photo')}
                      className={styles.fileInput}
                    />

                    <label
                      htmlFor={`photo-${index}`}
                      className={`${styles.photoDropzone} ${
                        shouldShowError(index, 'photo')
                          ? 'photoDropzoneError'
                          : ''
                      }`}
                    >
                      <div className={styles.uploadIcon}>
                        {vehicle.photo ? '✓' : '📷'}
                      </div>

                      <strong>
                        {vehicle.photo
                          ? vehicle.photo.name
                          : 'Ajouter une photo'}
                      </strong>

                      <span>
                        {vehicle.photo
                          ? `${(vehicle.photo.size / 1024 / 1024).toFixed(
                              2,
                            )} MB`
                          : 'Cliquez pour sélectionner une image'}
                      </span>

                      <small>PNG ou JPG · 2 MB maximum</small>
                    </label>

                    <FieldError index={index} field='photo' />
                  </div>
                </section>

                {/* =============================================
                    REMOVE VEHICLE
                ============================================== */}

                <div className={styles.vehicleCardFooter}>
                  <button
                    type='button'
                    className='deleteBtn'
                    onClick={() => onRemove(index)}
                    disabled={vehicles.length === 1 || loading}
                  >
                    🗑️ Supprimer ce véhicule
                  </button>
                </div>
              </div>
            )
          })}

          {/* ===================================================
              ADD VEHICLE
          ==================================================== */}

          <button
            type='button'
            className={styles.addVehicleBtn}
            onClick={onAdd}
            disabled={loading}
          >
            <span>＋</span>
            Ajouter un véhicule
          </button>

          {/* ===================================================
              SHIPPING
          ==================================================== */}

          <section className={styles.shippingCard}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>🚢</div>

              <div>
                <h3>Fret maritime</h3>

                <p>Paramètres liés au transport international</p>
              </div>
            </div>

            <div className={styles.grid2}>
              {/* FREIGHT */}

              <div className={styles.field}>
                <label>Prix du fret maritime</label>

                <div className={styles.inputWithUnit}>
                  <input
                    type='number'
                    min='0'
                    step='0.01'
                    value={shipping?.oceanFreight || 0}
                    onChange={(e) =>
                      onShippingUpdate(
                        'oceanFreight',
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    placeholder='0.00'
                    className={styles.input}
                  />
                </div>
              </div>

              {/* ASSURANCE */}

              <div className={styles.field}>
                <label>Assurance</label>

                <input
                  type='number'
                  min='0'
                  step='0.01'
                  value={shipping?.insurance || 0}
                  onChange={(e) =>
                    onShippingUpdate(
                      'insurance',
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  placeholder='0.00'
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.totalsGrid}>
              <div className={styles.totalBox}>
                <span>Total FOB</span>

                <strong>{totals?.fob || 0}</strong>
              </div>

              <div className={`${styles.totalBox} ${styles.totalBoxPrimary}`}>
                <span>Total CIF</span>

                <strong>{totals?.total || 0}</strong>
              </div>
            </div>

            <div className={styles.grid2}>
              {/* SHIPPING CURRENCY */}
              <div className={styles.field}>
                <label>
                  Devise <span className={styles.required}>*</span>
                </label>

                <select
                  value={shipping?.devise || ''}
                  onChange={(e) => onShippingUpdate('devise', e.target.value)}
                  className={`${styles.input} ${
                    submitted && !isValidCurrency(shipping?.devise)
                      ? 'error'
                      : ''
                  }`}
                >
                  <option value='' disabled>
                    Sélectionner une devise
                  </option>
                  <option value='EUR'>EUR (€)</option>
                  <option value='USD'>USD ($)</option>
                  <option value='CAD'>CAD ($)</option>
                  <option value='CHF'>CHF (Fr)</option>
                  <option value='GBP'>GBP (£)</option>
                  <option value='XOF'>XOF (FCFA)</option>
                  <option value='XAF'>XAF (FCFA)</option>
                </select>

                {submitted && !isValidCurrency(shipping?.devise) && (
                  <span className={styles.fieldErrorMessage}>
                    Veuillez sélectionner une devise.
                  </span>
                )}
              </div>

              {/* INCOTERM */}

              <div className={styles.field}>
                <label>Incoterm</label>

                <select
                  value={shipping?.incoterm || ''}
                  onChange={(e) => onShippingUpdate('incoterm', e.target.value)}
                  className={`${styles.input} ${
                    submitted && !isValidIncoterm(shipping?.incoterm)
                      ? 'error'
                      : ''
                  }`}
                >
                  <option value=''>Aucun incoterm</option>
                  <option value='EXW'>EXW</option>
                  <option value='FOB'>FOB</option>
                  <option value='CIF'>CIF</option>
                  <option value='CFR'>CFR</option>
                </select>

                {submitted && !isValidIncoterm(shipping?.incoterm) && (
                  <span className={styles.fieldErrorMessage}>
                    Incoterm invalide.
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* ===================================================
              FOOTER ACTIONS
          ==================================================== */}

          <div className={styles.formActions}>
            <div className={styles.formActionsInfo}>
              <span className={styles.required}>*</span>

              <span>Champs obligatoires</span>
            </div>

            <button
              type='submit'
              className={styles.primaryBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  Génération en cours...
                </>
              ) : (
                <>📄 Générer & simuler les droits de douane</>
              )}
            </button>
          </div>
        </form>
      </fieldset>
    )
  },
)

VehicleForm.displayName = 'VehicleForm'

export default VehicleForm
