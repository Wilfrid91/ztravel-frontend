import { forwardRef, useMemo, useState, useEffect } from 'react'
import styles from '../styles/ProductForm.module.css'
import ProductRow from './ProductRow'

const CURRENCIES = ['EUR', 'USD', 'CAD', 'CHF', 'GBP', 'XOF', 'XAF']
const INCOTERMS = ['EXW', 'FOB', 'CIF', 'CFR']

const Field = ({ label, required = false, error, hint, children }) => (
  <div className={styles.field}>
    <label>
      {label}
      {required && <span className={styles.required}> *</span>}
    </label>
    {children}
    {error && <span className={styles.fieldErrorMessage}>{error}</span>}
    {hint && !error && <span className={styles.fieldHint}>{hint}</span>}
  </div>
)

const SectionHeader = ({ icon, title, description }) => (
  <div className={styles.sectionHeader}>
    <div className={styles.sectionIcon}>{icon}</div>
    <div>
      <h4>{title}</h4>
      {description && <p>{description}</p>}
    </div>
  </div>
)

const NumberInput = ({
  value,
  onChange,
  min,
  max,
  step = '0.01',
  placeholder,
  unit,
  className,
}) => (
  <div className={styles.inputWithUnit}>
    <input
      type='number'
      min={min}
      max={max}
      step={step}
      value={value ?? ''}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />

    {unit && <span className={styles.unit}>{unit}</span>}
  </div>
)

const CurrencySelect = ({ value, onChange, className }) => (
  <select value={value ?? ''} onChange={onChange} className={className}>
    <option value=''>Sélectionner une devise</option>
    <option value='EUR'>EUR (€)</option>
    <option value='USD'>USD ($)</option>
    <option value='CAD'>CAD ($)</option>
    <option value='CHF'>CHF (Fr)</option>
    <option value='GBP'>GBP (£)</option>
    <option value='XOF'>XOF (CFA)</option>
    <option value='XAF'>XAF (CFA)</option>
  </select>
)

/*
 * ============================================================
 * VALIDATION D'UN PRODUIT
 * ============================================================
 *
 * Retourne un objet :
 *
 * {
 *   nom: '...',
 *   quantity: '...',
 *   prix: '...'
 * }
 *
 * Un champ absent de l'objet = champ valide.
 */
const validateProduct = (product = {}) => {
  const errors = {}

  // Nom
  if (!String(product.nom ?? '').trim()) {
    errors.nom = 'Le nom du produit est obligatoire.'
  } else if (String(product.nom).trim().length < 2) {
    errors.nom = 'Le nom doit contenir au moins 2 caractères.'
  } else if (String(product.nom).trim().length > 200) {
    errors.nom = 'Le nom ne doit pas dépasser 200 caractères.'
  }

  // Description
  if (!String(product.description ?? '').trim()) {
    errors.description = 'La description est obligatoire.'
  } else if (String(product.description).trim().length > 500) {
    errors.description = 'La description ne doit pas dépasser 500 caractères.'
  }

  // Longueur
  if (
    product.longueurCm === undefined ||
    product.longueurCm === null ||
    product.longueurCm === ''
  ) {
    errors.longueurCm = 'La longueur est obligatoire.'
  } else if (
    !Number.isFinite(Number(product.longueurCm)) ||
    Number(product.longueurCm) < 1 ||
    Number(product.longueurCm) > 2000
  ) {
    errors.longueurCm = 'La longueur doit être comprise entre 1 et 2000 cm.'
  }

  // Largeur
  if (
    product.largeurCm === undefined ||
    product.largeurCm === null ||
    product.largeurCm === ''
  ) {
    errors.largeurCm = 'La largeur est obligatoire.'
  } else if (
    !Number.isFinite(Number(product.largeurCm)) ||
    Number(product.largeurCm) < 1 ||
    Number(product.largeurCm) > 2000
  ) {
    errors.largeurCm = 'La largeur doit être comprise entre 1 et 2000 cm.'
  }

  // Hauteur
  if (
    product.hauteurCm === undefined ||
    product.hauteurCm === null ||
    product.hauteurCm === ''
  ) {
    errors.hauteurCm = 'La hauteur est obligatoire.'
  } else if (
    !Number.isFinite(Number(product.hauteurCm)) ||
    Number(product.hauteurCm) < 1 ||
    Number(product.hauteurCm) > 2000
  ) {
    errors.hauteurCm = 'La hauteur doit être comprise entre 1 et 2000 cm.'
  }

  // Poids
  if (
    product.poidsKg === undefined ||
    product.poidsKg === null ||
    product.poidsKg === ''
  ) {
    errors.poidsKg = 'Le poids est obligatoire.'
  } else if (
    !Number.isFinite(Number(product.poidsKg)) ||
    Number(product.poidsKg) < 0.1 ||
    Number(product.poidsKg) > 30000
  ) {
    errors.poidsKg = 'Le poids doit être compris entre 0,1 et 30 000 kg.'
  }

  // Quantité
  if (
    product.quantity === undefined ||
    product.quantity === null ||
    product.quantity === ''
  ) {
    errors.quantity = 'La quantité est obligatoire.'
  } else if (
    !Number.isInteger(Number(product.quantity)) ||
    Number(product.quantity) < 1 ||
    Number(product.quantity) > 9999
  ) {
    errors.quantity = 'La quantité doit être un entier compris entre 1 et 9999.'
  }

  // Nombre de colis
  if (
    product.numberOfBox === undefined ||
    product.numberOfBox === null ||
    product.numberOfBox === ''
  ) {
    errors.numberOfBox = 'Le nombre de colis est obligatoire.'
  } else if (
    !Number.isInteger(Number(product.numberOfBox)) ||
    Number(product.numberOfBox) < 1 ||
    Number(product.numberOfBox) > 9999
  ) {
    errors.numberOfBox =
      'Le nombre de colis doit être un entier compris entre 1 et 9999.'
  }

  // Prix
  if (
    product.prix === undefined ||
    product.prix === null ||
    product.prix === ''
  ) {
    errors.prix = 'Le prix est obligatoire.'
  } else if (
    !Number.isFinite(Number(product.prix)) ||
    Number(product.prix) <= 0
  ) {
    errors.prix = 'Le prix doit être supérieur à 0.'
  }

  // Devise
  if (!product.devise || !CURRENCIES.includes(product.devise)) {
    errors.devise = 'La devise est obligatoire.'
  }

  // Photo
  if (!product.photo) {
    errors.photo = 'La photo du produit est obligatoire.'
  }

  return errors
}

const validateShipping = (shipping = {}) => {
  const errors = {}

  // Fret maritime
  if (
    shipping.oceanFreight === undefined ||
    shipping.oceanFreight === null ||
    shipping.oceanFreight === ''
  ) {
    errors.oceanFreight = 'Le fret maritime est obligatoire.'
  } else if (
    !Number.isFinite(Number(shipping.oceanFreight)) ||
    Number(shipping.oceanFreight) <= 0
  ) {
    errors.oceanFreight = 'Le fret maritime doit être supérieur à 0.'
  }

  // Assurance
  if (
    shipping.insurance === undefined ||
    shipping.insurance === null ||
    shipping.insurance === ''
  ) {
    errors.insurance = 'L’assurance est obligatoire.'
  } else if (
    // « Est-ce que shipping.insurance, converti en nombre, est bien un nombre réel et fini ? doit retourner true
    !Number.isFinite(Number(shipping.insurance)) ||
    Number(shipping.oceanFreight) <= 0
  ) {
    errors.insurance = 'L’assurance doit être supérieure à 0.'
  }

  // Devise
  if (!shipping.devise || !CURRENCIES.includes(shipping.devise)) {
    errors.devise = 'La devise d’expédition est obligatoire.'
  }

  // Incoterm
  if (!shipping.incoterm || !INCOTERMS.includes(shipping.incoterm)) {
    errors.incoterm = 'L’incoterm est obligatoire.'
  }

  return errors
}

const ProductForm = forwardRef(
  (
    {
      products = [],
      onUpdate,
      onAdd,
      onRemove,
      shipping = {},
      onShippingUpdate,
      totals = {},
      onSubmit,
      loading = false,
    },
    ref,
  ) => {
    /*
     * ============================================================
     *                         ÉTAT DE VALIDATION
     * ============================================================
     *
     * submitted :
     *   false = validation progressive
     *   true  = tous les champs doivent être validés
     *
     * touched :
     *   mémorise les champs qui ont déjà été modifiés.
     */
    const [submitted, setSubmitted] = useState(false)
    const [touched, setTouched] = useState({})

    /*
     * ============================================================
     * ERREURS DE TOUS LES PRODUITS
     * ============================================================
     * useMemo: Mémorise le résultat d'un calcul afin d'éviter de le recalculer à chaque rendu du composant.
     */
    const productErrors = useMemo(() => {
      return products.map((product) => validateProduct(product))
    }, [products])

    const shippingErrors = useMemo(() => {
      return validateShipping(shipping)
    }, [shipping])

    /*
     * Nombre total d'erreurs
     */
    const totalErrors = useMemo(() => {
      const productErrorCount = productErrors.reduce(
        (total, errors) => total + Object.keys(errors).length,
        0,
      )

      const shippingErrorCount = Object.keys(shippingErrors).length

      return productErrorCount + shippingErrorCount
    }, [productErrors, shippingErrors])

    /*
     * ============================================================
     * CHAMP MODIFIÉ
     * ============================================================
     */
    const markTouched = (index, field) => {
      setTouched((prev) => ({
        ...prev,
        [`${index}.${field}`]: true,
      }))
    }

    /*
     * ============================================================
     * SAVOIR SI UN CHAMP A ÉTÉ TOUCHÉ
     * ============================================================
     */
    const isTouched = (index, field) => {
      return Boolean(touched[`${index}.${field}`])
    }

    const markShippingTouched = (field) => {
      setTouched((prev) => ({
        ...prev,
        [`shipping.${field}`]: true,
      }))
    }

    const isShippingTouched = (field) => {
      return Boolean(touched[`shipping.${field}`])
    }
    /*
     * ============================================================
     * ERREUR DU CHAMP
     * ============================================================
     *
     * Avant interaction :
     *   aucune erreur affichée.
     *
     * Après modification :
     *   validation du champ.
     *
     * Après Submit :
     *   tous les champs sont validés.
     */
    const hasFieldError = (index, field) => {
      if (!submitted && !isTouched(index, field)) {
        return false
      }

      return Boolean(productErrors[index]?.[field])
    }

    /*
     * ============================================================
     *                  CHAMP VALIDE
     * ============================================================
     */
    const isFieldValid = (index, field) => {
      if (!submitted && !isTouched(index, field)) {
        return false
      }

      return !productErrors[index]?.[field]
    }

    /*
     * ============================================================
     *                    CLASSE CSS DU CHAMP
     * ============================================================
     */
    const getInputClass = (index, field) => {
      const baseClass = styles.input

      if (hasFieldError(index, field)) {
        return `${baseClass} ${styles.error}`
      }

      if (isFieldValid(index, field)) {
        return `${baseClass} ${styles.valid}`
      }

      return baseClass
    }

    /*
     * ============================================================
     *
     * ============================================================
     */
    const hasShippingError = (field) => {
      if (!submitted && !isShippingTouched(field)) {
        return false
      }

      return Boolean(shippingErrors[field])
    }

    const isShippingValid = (field) => {
      if (!submitted && !isShippingTouched(field)) {
        return false
      }

      return !shippingErrors[field]
    }

    const getShippingInputClass = (field) => {
      const baseClass = styles.input

      if (hasShippingError(field)) {
        return `${baseClass} ${styles.error}`
      }

      if (isShippingValid(field)) {
        return `${baseClass} ${styles.valid}`
      }

      return baseClass
    }

    /*
     * ============================================================
     * MODIFICATION DES NOMBRES
     * ============================================================
     */
    const handleNumberChange = (index, field, value, type = 'float') => {
      markTouched(index, field)

      if (value === '') {
        onUpdate(index, field, '')
        return
      }

      const parsed = type === 'int' ? parseInt(value, 10) : parseFloat(value)

      if (Number.isNaN(parsed)) {
        onUpdate(index, field, value)
        return
      }

      onUpdate(index, field, parsed)
    }

    /**
     *  Synchronisation de la devise du shipping avec celle du produit
     * Option B (découplage propre) : le champ produit appelle onUpdate(index, 'devise', ...), et un useEffect :
     */
    useEffect(() => {
      const devise = products.find((p) => p.devise)?.devise
      if (devise && devise !== shipping.devise) {
        markShippingTouched('devise')
        onShippingUpdate('devise', devise)
      }
    }, [products, shipping.devise])

    /*
     * ============================================================
     *                        SOUMISSION
     * ============================================================
     */

    const handleSubmit = async (event) => {
      event.preventDefault()

      // Afficher toutes les erreurs
      setSubmitted(true)

      // Validation immédiate
      const currentProductErrors = products.map((product) =>
        validateProduct(product),
      )

      console.log('Objet shipping :', shipping)
      console.log('Fret maritime :', shipping?.oceanFreight)
      console.log('Assurance :', shipping?.insurance)

      const currentShippingErrors = validateShipping(shipping)

      console.log('Erreurs transport :', currentShippingErrors)

      const productErrorCount = currentProductErrors.reduce(
        (total, errors) => total + Object.keys(errors).length,
        0,
      )

      const shippingErrorCount = Object.keys(currentShippingErrors).length

      const totalErrorCount = productErrorCount + shippingErrorCount

      console.log('Validation produits :', currentProductErrors)
      console.log('Validation transport :', currentShippingErrors)
      console.log('Nombre total d’erreurs :', totalErrorCount)

      // Arrêter si le formulaire est invalide
      if (totalErrorCount > 0) {
        return
      }

      try {
        // Soumettre le formulaire
        await onSubmit?.()
        // Réinitialiser uniquement après une soumission réussie
        setTouched({})
        setSubmitted(false)
      } catch (error) {
        console.error('Erreur lors de la soumission :', error)
      }
    }

    /*
     * ============================================================
     * RENDU
     * ============================================================
     */
    return (
      <fieldset className={styles.productForm}>
        {/* =========================================================
                                EN-TÊTE
            ========================================================= */}
        <div className={styles.formHeader}>
          <div className={styles.formHeaderIcon}>📦</div>
          <div>
            <h2>Gestion des produits</h2>
            <p>
              Renseignez les caractéristiques de vos produits pour calculer les
              droits de douane.
            </p>
          </div>
        </div>

        <form
          ref={ref}
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
        >
          {/* =======================================================
                                PRODUITS
            ======================================================= */}
          {products.map((product, index) => {
            const errors = productErrors[index] || {}
            const errorCount = Object.keys(errors).length
            const productHasError = submitted && errorCount > 0

            return (
              <ProductRow
                key={product.id || product._id || index}
                product={product}
                index={index}
                errors={errors}
                submitted={submitted}
                onUpdate={onUpdate}
                hasFieldError={hasFieldError}
                markTouched={markTouched}
                getInputClass={getInputClass}
                onRemove={onRemove} // ← ajouter ici
                productsLength={products.length}
              />
            )
          })}

          {/* =======================================================
                                  AJOUT PRODUIT
            ======================================================= */}
          <div className={styles.btnContainer}>
            <button type='button' className={styles.addBtn} onClick={onAdd}>
              ＋ Ajouter un produit
            </button>
          </div>

          {/* =======================================================
                                        TRANSPORT
            ======================================================= */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>🚢</div>
              <div>
                <h3>Fret maritime</h3>
                <p>Informations nécessaires au calcul des droits et taxes.</p>
              </div>
            </div>

            {/* FRET + ASSURANCE */}
            <div className={styles.grid2}>
              <Field
                label='Prix du fret maritime'
                required
                error={
                  hasShippingError('oceanFreight')
                    ? shippingErrors.oceanFreight
                    : null
                }
              >
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  value={shipping.oceanFreight ?? 0}
                  onChange={(e) =>
                    onShippingUpdate(
                      'oceanFreight',
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  placeholder='Fret maritime'
                  className={styles.input}
                />
              </Field>

              <Field
                label='Assurance'
                required
                error={
                  hasShippingError('insurance')
                    ? shippingErrors.insurance
                    : null
                }
              >
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  value={shipping.insurance ?? 0}
                  onChange={(e) =>
                    onShippingUpdate(
                      'insurance',
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  placeholder='Assurance'
                  className={styles.input}
                />
              </Field>
            </div>

            {/* TOTAUX */}
            <div className={styles.grid2}>
              <Field label='Total FOB'>
                <input
                  type='number'
                  value={totals.fob ?? 0}
                  readOnly
                  className={`${styles.input} ${styles.readonly}`}
                />
              </Field>

              <Field label='Total CIF'>
                <input
                  type='number'
                  value={totals.total ?? 0}
                  readOnly
                  className={`${styles.input} ${styles.readonly}`}
                />
              </Field>
            </div>

            {/* DEVISE + INCOTERM */}
            <div className={styles.grid2}>
              <Field
                label='Devise'
                required
                error={
                  hasShippingError('devise') ? shippingErrors.devise : null
                }
              >
                <CurrencySelect
                  value={shipping.devise ?? ''}
                  onChange={(e) => {
                    markShippingTouched('devise')
                    onShippingUpdate('devise', e.target.value)
                  }}
                  className={getShippingInputClass('devise')}
                />
              </Field>

              <Field
                label='Incoterm'
                required
                error={
                  hasShippingError('incoterm') ? shippingErrors.incoterm : null
                }
              >
                <select
                  value={shipping.incoterm ?? ''}
                  onChange={(e) => {
                    markShippingTouched('incoterm')

                    onShippingUpdate('incoterm', e.target.value)
                  }}
                  className={getShippingInputClass('incoterm')}
                >
                  <option value=''>Sélectionner un incoterm</option>

                  {INCOTERMS.map((incoterm) => (
                    <option key={incoterm} value={incoterm}>
                      {incoterm}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          {/* =======================================================
          RÉSUMÉ DES ERREURS
      ======================================================= */}
          {submitted && totalErrors > 0 && (
            <div className={styles.formErrorSummary} role='alert'>
              <div className={styles.formErrorSummaryHeader}>
                <span className={styles.formErrorIcon}>!</span>

                <div>
                  <strong>Vérifiez les informations saisies</strong>

                  <p>
                    {totalErrors}{' '}
                    {totalErrors > 1
                      ? 'champs nécessitent une correction.'
                      : 'champ nécessite une correction.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =======================================================
          ACTION
      ======================================================= */}
          <div className={styles.actions}>
            <div className={styles.actionsInfo}>
              <span>✓</span>
              <span>Les montants seront recalculés avant la simulation.</span>
            </div>
            <button
              type='submit'
              className={styles.primaryBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} aria-hidden='true' />
                  Génération en cours...
                </>
              ) : (
                '📄 Générer & simuler les droits de douane'
              )}
            </button>
          </div>
        </form>
      </fieldset>
    )
  },
)

ProductForm.displayName = 'ProductForm'

export default ProductForm
