import { useState, useMemo } from 'react'
import axios from '../utils/axiosInstance'
import styles from '../styles/ProductForm.module.css'

const ProductRow = ({
  product,
  index,
  onUpdate,
  errors,
  hasFieldError,
  markTouched,
  getInputClass,
  submitted,
  onRemove, // ← ajouter ici
  productsLength, // ← pour le disabled, voir plus bas
  handleProductFieldChange,
}) => {
  // ← les états vivent ICI, un jeu par ligne produit
  const [shSuggestion, setShSuggestion] = useState(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [touched, setTouched] = useState({})

  const errorCount = Object.keys(errors || {}).length
  const productHasError = submitted && errorCount > 0

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

  const detectCodeSH = async () => {
    const description = product.nom?.trim()
    if (!description || description.length < 5 || product.codeSH) return

    setIsDetecting(true)
    try {
      const resp = await axios.post('/api/v1/codesh/best', { description })
      setShSuggestion(resp.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsDetecting(false)
    }
  }

  const applySuggestion = (item) => {
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
  }

  return (
    <article
      key={product.id || product._id || index}
      className={`${styles.productCard} ${
        productHasError ? styles.productCardError : ''
      }`}
    >
      {/* -------------------------------------------------
                                    EN-TÊTE PRODUIT
      ------------------------------------------------- */}
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

      {/* =================================================
                    CARACTÉRISTIQUES
      ================================================= */}
      <section className={styles.formSection}>
        <SectionHeader
          icon='⚙️'
          title='Caractéristiques techniques'
          description='Dimensions et poids du produit'
        />

        {/* NOM + DESCRIPTION */}
        <div className={styles.grid2}>
          <Field
            label='Nom'
            required
            error={hasFieldError(index, 'nom') ? errors.nom : null}
            hint={product.nom ? `${product.nom.length}/200 caractères` : null}
          >
            <input
              type='text'
              value={product.nom ?? ''}
              onChange={(e) => {
                markTouched(index, 'nom')
                onUpdate(index, 'nom', e.target.value)
                // Si l'utilisateur modifie le nom, on invalide la suggestion en cours
                setShSuggestion(null)
              }}
              onBlur={detectCodeSH} // ← détection à la sortie du champ
              placeholder='Nom du produit'
              maxLength={200}
              className={getInputClass(index, 'nom')}
            />
          </Field>
          {isDetecting && <span>Détection du code SH...</span>}

          {shSuggestion && (
            <div className={styles.shSuggestion}>
              <p>
                Code SH suggéré : <strong>{shSuggestion.code}</strong>
                {shSuggestion.needsReview && (
                  <em> (à confirmer — plusieurs codes possibles)</em>
                )}
              </p>

              {/* ← ICI : applySuggestion est utilisée */}
              <button
                type='button'
                onClick={() => applySuggestion(shSuggestion)}
              >
                Utiliser ce code
              </button>

              <button type='button' onClick={() => setShSuggestion(null)}>
                Ignorer
              </button>
              {/* Et ici pour les candidats alternatifs si needsReview */}
              {shSuggestion.needsReview &&
                shSuggestion.candidates?.length > 1 && (
                  <ul>
                    {shSuggestion.candidates.slice(1).map((c) => (
                      <li key={c.code}>
                        <button
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
            error={
              hasFieldError(index, 'description') ? errors.description : null
            }
            hint={
              product.description
                ? `${product.description.length}/500 caractères`
                : null
            }
          >
            <input
              type='text'
              value={product.description ?? ''}
              onChange={(e) => {
                markTouched(index, 'description')

                onUpdate(index, 'description', e.target.value)
              }}
              placeholder='Description du produit'
              maxLength={500}
              className={getInputClass(index, 'description')}
            />
          </Field>
        </div>

        {/* DIMENSIONS */}
        <div className={styles.sectionTitle}>Dimensions</div>
        <div className={styles.grid3}>
          <Field
            label='Longueur'
            required
            error={
              hasFieldError(index, 'longueurCm') ? errors.longueurCm : null
            }
          >
            <NumberInput
              value={product.longueurCm}
              min='1'
              max='2000'
              step='0.01'
              placeholder='1 - 2000'
              unit='cm'
              className={getInputClass(index, 'longueurCm')}
              onChange={(e) =>
                handleNumberChange(index, 'longueurCm', e.target.value)
              }
            />
          </Field>

          <Field
            label='Largeur'
            required
            error={hasFieldError(index, 'largeurCm') ? errors.largeurCm : null}
          >
            <NumberInput
              value={product.largeurCm}
              min='1'
              max='2000'
              step='0.01'
              placeholder='1 - 2000'
              unit='cm'
              className={getInputClass(index, 'largeurCm')}
              onChange={(e) =>
                handleNumberChange(index, 'largeurCm', e.target.value)
              }
            />
          </Field>

          <Field
            label='Hauteur'
            required
            error={hasFieldError(index, 'hauteurCm') ? errors.hauteurCm : null}
          >
            <NumberInput
              value={product.hauteurCm}
              min='1'
              max='2000'
              step='0.01'
              placeholder='1 - 2000'
              unit='cm'
              className={getInputClass(index, 'hauteurCm')}
              onChange={(e) =>
                handleNumberChange(index, 'hauteurCm', e.target.value)
              }
            />
          </Field>
        </div>

        {/* POIDS / QUANTITÉ / COLIS */}
        <div className={styles.grid3}>
          <Field
            label='Poids'
            required
            error={hasFieldError(index, 'poidsKg') ? errors.poidsKg : null}
          >
            <NumberInput
              value={product.poidsKg}
              min='0.1'
              max='30000'
              step='0.1'
              placeholder='0,1 - 30 000'
              unit='kg'
              className={getInputClass(index, 'poidsKg')}
              onChange={(e) =>
                handleNumberChange(index, 'poidsKg', e.target.value)
              }
            />
          </Field>

          <Field
            label='Quantité'
            required
            error={hasFieldError(index, 'quantity') ? errors.quantity : null}
          >
            <input
              type='number'
              min='1'
              max='9999'
              value={product.quantity ?? ''}
              onChange={(e) =>
                handleNumberChange(index, 'quantity', e.target.value, 'int')
              }
              placeholder='1 - 9999'
              className={getInputClass(index, 'quantity')}
            />
          </Field>

          <Field
            label='Nombre de colis'
            required
            error={
              hasFieldError(index, 'numberOfBox') ? errors.numberOfBox : null
            }
          >
            <input
              type='number'
              min='1'
              max='9999'
              value={product.numberOfBox ?? ''}
              onChange={(e) =>
                handleNumberChange(index, 'numberOfBox', e.target.value, 'int')
              }
              placeholder='1 - 9999'
              className={getInputClass(index, 'numberOfBox')}
            />
          </Field>
        </div>
      </section>

      {/* =================================================
                    TARIFICATION
      ================================================= */}
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
            error={hasFieldError(index, 'prix') ? errors.prix : null}
          >
            <input
              type='number'
              min='0.01'
              step='0.01'
              value={product.prix ?? ''}
              onChange={(e) =>
                handleNumberChange(index, 'prix', e.target.value)
              }
              placeholder='Prix unitaire'
              className={getInputClass(index, 'prix')}
            />
          </Field>

          <Field
            label='Devise'
            required
            error={hasFieldError(index, 'devise') ? errors.devise : null}
          >
            <CurrencySelect
              value={product.devise ?? ''}
              onChange={(e) =>
                handleProductFieldChange(index, 'devise', e.target.value)
              }
              className={getInputClass(index, 'devise')}
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

      {/* =================================================
                    PHOTO
      ================================================= */}
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

      {/* =================================================
                    SUPPRESSION
      ================================================= */}
      <button
        type='button'
        className={styles.deleteBtn}
        onClick={() => onRemove(index)}
        disabled={product.length === 1}
      >
        🗑️ Supprimer ce produit
      </button>
    </article>
  )
}

export default ProductRow
