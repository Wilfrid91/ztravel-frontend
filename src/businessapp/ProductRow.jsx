import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import axios from '../utils/axiosInstance'
import styles from '../styles/ProductForm.module.css'

/* ============================================================
 * SOUS-COMPOSANTS EXTRAITS HORS DE ProductRow
 * ============================================================
 * ⚠️ CRUCIAL : s'ils sont déclarés DANS ProductRow, ils sont
 * recréés à chaque render → React démonte/remonte tous les
 * <input> à chaque frappe → latence + perte de focus.
 */

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

/* ============================================================
 * PRODUCT ROW
 * ============================================================
 * Props stables attendues (via React.memo) :
 *   - product     : objet produit (change quand CE produit change)
 *   - index       : number
 *   - errors      : objet d'erreurs de CE produit (stable si produit stable)
 *   - onUpdate    : useCallback côté parent
 *   - onRemove    : useCallback côté parent
 *   - productsLength : number
 *   - submitted   : boolean
 *
 * ⚠️ touched, hasFieldError, getInputClass sont CALCULÉS ICI,
 * plus passés depuis le parent → props stables garanties.
 */

const ProductRow = ({
  product,
  index,
  errors = {},
  onUpdate,
  onRemove,
  productsLength,
  submitted,
}) => {
  const [shSuggestion, setShSuggestion] = useState(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [touched, setTouched] = useState({})

  const renderCount = useRef(0)
  renderCount.current++
  console.log(`🟢 ProductRow[${index}] render #${renderCount.current}`, {
    product,
    errors,
    submitted,
    onUpdateStable: onUpdate, // ← vérifier si la ref change
  })

  /* ----------------------------------------------------------
   * Erreurs / validation locales
   * ---------------------------------------------------------- */
  const hasFieldError = useCallback(
    (field) => {
      if (!submitted && !touched[field]) return false
      return Boolean(errors[field])
    },
    [submitted, touched, errors],
  )

  const getInputClass = useCallback(
    (field) => {
      const base = styles.input
      if (hasFieldError(field)) return `${base} ${styles.error}`
      const isValid = (submitted || touched[field]) && !errors[field]
      return isValid ? `${base} ${styles.valid}` : base
    },
    [hasFieldError, submitted, touched, errors],
  )

  const markTouched = useCallback((field) => {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }))
  }, [])

  const errorCount = Object.keys(errors).length
  const productHasError = submitted && errorCount > 0

  /* ----------------------------------------------------------
   * Handlers
   * ---------------------------------------------------------- */
  const handleNumberChange = useCallback(
    (field, value, type = 'float') => {
      markTouched(field)
      if (value === '') {
        onUpdate(index, field, '')
        return
      }
      const parsed = type === 'int' ? parseInt(value, 10) : parseFloat(value)
      onUpdate(index, field, Number.isNaN(parsed) ? value : parsed)
    },
    [markTouched, onUpdate, index],
  )

  const handleFieldChange = useCallback(
    (field, value) => {
      markTouched(field)
      onUpdate(index, field, value)
    },
    [markTouched, onUpdate, index],
  )

  /* ----------------------------------------------------------
   * Détection code SH
   * ---------------------------------------------------------- */
  const detectCodeSH = useCallback(async () => {
    const description = product.nom?.trim()
    if (!description || description.length < 5 || product.codeSH) return

    setIsDetecting(true)
    try {
      const resp = await axios.post('/api/v1/business/codesh/best', {
        description,
      })
      setShSuggestion(resp.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsDetecting(false)
    }
  }, [product.nom, product.codeSH])

  useEffect(() => {
    const description = product.nom?.trim()
    if (!description || description.length < 5 || product.codeSH) return

    const timer = setTimeout(() => {
      detectCodeSH()
    }, 700)

    return () => clearTimeout(timer)
  }, [product.nom, product.codeSH, detectCodeSH])

  const applySuggestion = useCallback(
    (item) => {
      onUpdate(index, 'codeSH', item.code)
      onUpdate(index, 'taxes', {
        tauxDD: item.tauxDD,
        tauxTVA: item.tauxTVA,
        tauxPCS: item.tauxPCS,
        tauxPC: item.tauxPC,
        tauxPS: item.tauxPS,
        tauxRAU: item.tauxRAU,
        tauxAIB: item.tauxAIB,
        tauxRS: item.tauxRS,
      })
      setShSuggestion(null)
    },
    [onUpdate, index],
  )

  /* ----------------------------------------------------------
   * Rendu
   * ---------------------------------------------------------- */
  return (
    <article
      className={`${styles.productCard} ${
        productHasError ? styles.productCardError : ''
      }`}
    >
      {/* EN-TÊTE PRODUIT */}
      <div className={styles.productHeader}>
        <div className={styles.productTitle}>
          <div className={styles.productNumber}>{index + 1}</div>
          <div>
            <h3>Produit {index + 1}</h3>
            <p>Informations générales et caractéristiques techniques</p>
          </div>
        </div>
        {productHasError && (
          <span className={styles.errorBadge}>
            ⚠️ {errorCount}{' '}
            {errorCount > 1 ? 'champs invalides' : 'champ invalide'}
          </span>
        )}
      </div>

      {/* CARACTÉRISTIQUES */}
      <section className={styles.formSection}>
        <SectionHeader
          icon='⚙️'
          title='Caractéristiques techniques'
          description='Dimensions et poids du produit'
        />

        <div className={styles.grid2}>
          <Field
            label='Nom'
            required
            error={hasFieldError('nom') ? errors.nom : null}
            hint={product.nom ? `${product.nom.length}/200 caractères` : null}
          >
            <input
              type='text'
              value={product.nom ?? ''}
              onChange={(e) => {
                handleFieldChange('nom', e.target.value)
                setShSuggestion(null)
              }}
              placeholder='Nom du produit'
              maxLength={200}
              className={getInputClass('nom')}
            />
          </Field>

          {isDetecting && <span>Détection du code SH...</span>}

          {shSuggestion && (
            <div className={styles.shSuggestion}>
              <p className={styles.shSuggestionTitle}>
                Code SH suggéré : <strong>{shSuggestion.code}</strong>
                {shSuggestion.needsReview && (
                  <em> (à confirmer, plusieurs codes possibles)</em>
                )}
              </p>

              <div className={styles.shActions}>
                <button
                  className={styles.shApplyButton}
                  type='button'
                  onClick={() => applySuggestion(shSuggestion)}
                >
                  Utiliser ce code
                </button>
                <button
                  className={styles.shIgnoreButton}
                  type='button'
                  onClick={() => setShSuggestion(null)}
                >
                  Ignorer
                </button>
              </div>

              {shSuggestion.needsReview &&
                shSuggestion.candidates?.length > 1 && (
                  <ul className={styles.shCandidates}>
                    {shSuggestion.candidates.slice(1).map((c) => (
                      <li key={c.code}>
                        <button
                          className={styles.shCandidateButton}
                          type='button'
                          onClick={() => applySuggestion(c)}
                        >
                          {c.code} — {c.libelle}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          )}

          <Field
            label='Description'
            required
            error={hasFieldError('description') ? errors.description : null}
            hint={
              product.description
                ? `${product.description.length}/500 caractères`
                : null
            }
          >
            <input
              type='text'
              value={product.description ?? ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder='Description du produit'
              maxLength={500}
              className={getInputClass('description')}
            />
          </Field>
        </div>

        {/* DIMENSIONS */}
        <div className={styles.sectionTitle}>Dimensions</div>
        <div className={styles.grid3}>
          <Field
            label='Longueur'
            required
            error={hasFieldError('longueurCm') ? errors.longueurCm : null}
          >
            <NumberInput
              value={product.longueurCm}
              min='1'
              max='2000'
              step='0.01'
              placeholder='1 - 2000'
              unit='cm'
              className={getInputClass('longueurCm')}
              onChange={(e) => handleNumberChange('longueurCm', e.target.value)}
            />
          </Field>

          <Field
            label='Largeur'
            required
            error={hasFieldError('largeurCm') ? errors.largeurCm : null}
          >
            <NumberInput
              value={product.largeurCm}
              min='1'
              max='2000'
              step='0.01'
              placeholder='1 - 2000'
              unit='cm'
              className={getInputClass('largeurCm')}
              onChange={(e) => handleNumberChange('largeurCm', e.target.value)}
            />
          </Field>

          <Field
            label='Hauteur'
            required
            error={hasFieldError('hauteurCm') ? errors.hauteurCm : null}
          >
            <NumberInput
              value={product.hauteurCm}
              min='1'
              max='2000'
              step='0.01'
              placeholder='1 - 2000'
              unit='cm'
              className={getInputClass('hauteurCm')}
              onChange={(e) => handleNumberChange('hauteurCm', e.target.value)}
            />
          </Field>
        </div>

        {/* POIDS / QUANTITÉ / COLIS */}
        <div className={styles.grid3}>
          <Field
            label='Poids'
            required
            error={hasFieldError('poidsKg') ? errors.poidsKg : null}
          >
            <NumberInput
              value={product.poidsKg}
              min='0.1'
              max='30000'
              step='0.1'
              placeholder='0,1 - 30 000'
              unit='kg'
              className={getInputClass('poidsKg')}
              onChange={(e) => handleNumberChange('poidsKg', e.target.value)}
            />
          </Field>

          <Field
            label='Quantité'
            required
            error={hasFieldError('quantity') ? errors.quantity : null}
          >
            <input
              type='number'
              min='1'
              max='9999'
              value={product.quantity ?? ''}
              onChange={(e) =>
                handleNumberChange('quantity', e.target.value, 'int')
              }
              placeholder='1 - 9999'
              className={getInputClass('quantity')}
            />
          </Field>

          <Field
            label='Nombre de colis'
            required
            error={hasFieldError('numberOfBox') ? errors.numberOfBox : null}
          >
            <input
              type='number'
              min='1'
              max='9999'
              value={product.numberOfBox ?? ''}
              onChange={(e) =>
                handleNumberChange('numberOfBox', e.target.value, 'int')
              }
              placeholder='1 - 9999'
              className={getInputClass('numberOfBox')}
            />
          </Field>
        </div>
      </section>

      {/* TARIFICATION */}
      <section className={styles.formSection}>
        <SectionHeader
          icon='💰'
          title='Prix et devise'
          description='Informations financières du produit'
        />

        <div className={styles.grid3}>
          <Field
            label='Prix unitaire'
            required
            error={hasFieldError('prix') ? errors.prix : null}
          >
            <input
              type='number'
              min='0.01'
              step='0.01'
              value={product.prix ?? ''}
              onChange={(e) => handleNumberChange('prix', e.target.value)}
              placeholder='Prix unitaire'
              className={getInputClass('prix')}
            />
          </Field>

          <Field
            label='Devise'
            required
            error={hasFieldError('devise') ? errors.devise : null}
          >
            <CurrencySelect
              value={product.devise ?? ''}
              onChange={(e) => handleFieldChange('devise', e.target.value)}
              className={getInputClass('devise')}
            />
          </Field>

          <Field label='Prix total' hint='Calculé automatiquement'>
            <input
              type='number'
              value={product.prixTotal ?? 0}
              readOnly
              className={`${styles.input} ${styles.readonly}`}
            />
          </Field>
        </div>
      </section>

      {/* PHOTO */}
      <section className={styles.formSection}>
        <SectionHeader
          icon='📷'
          title='Photo du produit'
          description='Ajoutez une photo représentative du produit'
        />
        <div className={styles.field}>
          <input
            type='file'
            accept='image/png,image/jpeg,image/jpg'
            onChange={(e) =>
              onUpdate(index, 'photo', e.target.files?.[0] || null)
            }
            className={styles.fileInput}
          />
          <span className={styles.fieldHint}>PNG ou JPG — 2 MB maximum</span>
        </div>
      </section>

      {/* SUPPRESSION */}
      <button
        type='button'
        className={styles.deleteBtn}
        onClick={() => onRemove(index)}
        disabled={productsLength === 1}
      >
        🗑️ Supprimer ce produit
      </button>
    </article>
  )
}

export default React.memo(ProductRow)
