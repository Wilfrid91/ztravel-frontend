// Fichier généré automatiquement
import React, { forwardRef } from 'react'
import styles from '../styles/ProductForm.module.css'

const ProductForm = forwardRef(
  (
    {
      products,
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
    const validateProduct = (product) => {
      const errors = []
      if (!product.nom || product.nom.trim().length < 2) {
        errors.push('Le nom doit contenir au moins 2 caractères')
      }
      if (product.nom && product.nom.length > 200) {
        errors.push('Le nom ne peut pas dépasser 200 caractères')
      }
      if (product.description && product.description.length > 500) {
        errors.push('La description ne peut pas dépasser 500 caractères')
      }
      if (
        product.longueurCm &&
        (product.longueurCm < 1 || product.longueurCm > 2000)
      ) {
        errors.push('La longueur doit être entre 1 et 2000 cm')
      }
      if (
        product.largeurCm &&
        (product.largeurCm < 1 || product.largeurCm > 2000)
      ) {
        errors.push('La largeur doit être entre 1 et 2000 cm')
      }
      if (
        product.hauteurCm &&
        (product.hauteurCm < 1 || product.hauteurCm > 2000)
      ) {
        errors.push('La hauteur doit être entre 1 et 2000 cm')
      }
      if (
        product.poidsKg &&
        (product.poidsKg < 0.1 || product.poidsKg > 30000)
      ) {
        errors.push('Le poids doit être entre 0.1 et 30000 kg')
      }
      if (
        !product.quantity ||
        product.quantity < 1 ||
        product.quantity > 9999
      ) {
        errors.push('La quantité doit être entre 1 et 9999')
      }
      if (
        !product.numberOfBox ||
        product.numberOfBox < 1 ||
        product.numberOfBox > 9999
      ) {
        errors.push('Le nombre de colis doit être entre 1 et 9999')
      }
      if (!product.prix || product.prix <= 0) {
        errors.push('Le prix unitaire doit être supérieur à 0')
      }
      if (
        !product.devise ||
        !['EUR', 'USD', 'CAD', 'CHF', 'GBP', 'XOF', 'XAF'].includes(
          product.devise,
        )
      ) {
        errors.push('Devise invalide')
      }
      return errors
    }

    // ✅ Vérification avant soumission
    const handleSubmit = () => {
      let allValid = true
      let errorMessages = []

      products.forEach((product, index) => {
        const errors = validateProduct(product)
        if (errors.length > 0) {
          allValid = false
          errorMessages.push(`Produit ${index + 1}: ${errors.join(', ')}`)
        }
      })

      // Vérification du shipping
      if (
        !shipping.devise ||
        !['EUR', 'USD', 'CAD', 'CHF', 'GBP', 'XOF', 'XAF'].includes(
          shipping.devise,
        )
      ) {
        allValid = false
        errorMessages.push('Devise de livraison invalide')
      }

      // ✅ Vérification Incoterm (doit être une valeur valide)
      if (
        !shipping.incoterm ||
        !['EXW', 'FOB', 'CIF', 'CFR'].includes(shipping.incoterm)
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
        <legend className={styles.legend}>📦 Gestion des produits</legend>

        <form ref={ref} className={styles.form}>
          {products.map((product, index) => {
            const errors = validateProduct(product)
            const hasError = errors.length > 0

            return (
              <div
                key={index}
                className={`${styles.productCard} ${hasError ? styles.productCardError : ''}`}
              >
                <div className={styles.productHeader}>
                  <h4>Produit {index + 1}</h4>
                  {hasError && (
                    <span className={styles.errorBadge}>
                      ⚠️ {errors.length} erreur{errors.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className={styles.grid2}>
                  {/* Nom */}
                  <div
                    className={`${styles.field} ${!product.nom || product.nom.length < 2 ? styles.fieldError : ''}`}
                  >
                    <label>
                      Nom * <span className={styles.required}>*</span>
                    </label>
                    <input
                      type='text'
                      value={product.nom || ''}
                      onChange={(e) => onUpdate(index, 'nom', e.target.value)}
                      placeholder='Nom du produit (2-200 caractères)'
                      maxLength={200}
                      className={
                        product.nom && product.nom.length >= 2
                          ? styles.valid
                          : ''
                      }
                    />
                    {product.nom && product.nom.length < 2 && (
                      <span className={styles.fieldHint}>
                        Minimum 2 caractères
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div
                    className={`${styles.field} ${product.description && product.description.length > 500 ? styles.fieldError : ''}`}
                  >
                    <label>Description</label>
                    <input
                      type='text'
                      value={product.description || ''}
                      onChange={(e) =>
                        onUpdate(index, 'description', e.target.value)
                      }
                      placeholder='Description (max 500 caractères)'
                      maxLength={500}
                    />
                    {product.description && (
                      <span className={styles.fieldHint}>
                        {product.description.length}/500 caractères
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.grid3}>
                  {/* Longueur */}
                  <div className={styles.field}>
                    <label>Longueur (cm)</label>
                    <input
                      type='number'
                      step='0.01'
                      min='1'
                      max='2000'
                      value={product.longueurCm || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        if (val >= 1 && val <= 2000) {
                          onUpdate(index, 'longueurCm', val)
                        } else {
                          onUpdate(index, 'longueurCm', e.target.value)
                        }
                      }}
                      placeholder='1-2000 cm'
                    />
                  </div>

                  {/* Largeur */}
                  <div className={styles.field}>
                    <label>Largeur (cm)</label>
                    <input
                      type='number'
                      step='0.01'
                      min='1'
                      max='2000'
                      value={product.largeurCm || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        if (val >= 1 && val <= 2000) {
                          onUpdate(index, 'largeurCm', val)
                        } else {
                          onUpdate(index, 'largeurCm', e.target.value)
                        }
                      }}
                      placeholder='1-2000 cm'
                    />
                  </div>

                  {/* Hauteur */}
                  <div className={styles.field}>
                    <label>Hauteur (cm)</label>
                    <input
                      type='number'
                      step='0.01'
                      min='1'
                      max='2000'
                      value={product.hauteurCm || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        if (val >= 1 && val <= 2000) {
                          onUpdate(index, 'hauteurCm', val)
                        } else {
                          onUpdate(index, 'hauteurCm', e.target.value)
                        }
                      }}
                      placeholder='1-2000 cm'
                    />
                  </div>
                </div>

                <div className={styles.grid3}>
                  {/* Poids */}
                  <div className={styles.field}>
                    <label>Poids (Kg)</label>
                    <input
                      type='number'
                      step='0.1'
                      min='0.1'
                      max='30000'
                      value={product.poidsKg || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        if (val >= 0.1 && val <= 30000) {
                          onUpdate(index, 'poidsKg', val)
                        } else {
                          onUpdate(index, 'poidsKg', e.target.value)
                        }
                      }}
                      placeholder='0.1-30000 kg'
                    />
                  </div>

                  {/* Quantité */}
                  <div
                    className={`${styles.field} ${!product.quantity || product.quantity < 1 ? styles.fieldError : ''}`}
                  >
                    <label>
                      Quantité * <span className={styles.required}>*</span>
                    </label>
                    <input
                      type='number'
                      min='1'
                      max='9999'
                      value={product.quantity || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (val >= 1 && val <= 9999) {
                          onUpdate(index, 'quantity', val)
                        } else {
                          onUpdate(index, 'quantity', e.target.value)
                        }
                      }}
                      placeholder='1-9999'
                      className={
                        product.quantity && product.quantity >= 1
                          ? styles.valid
                          : ''
                      }
                    />
                  </div>

                  {/* Nombre de colis */}
                  <div
                    className={`${styles.field} ${!product.numberOfBox || product.numberOfBox < 1 ? styles.fieldError : ''}`}
                  >
                    <label>
                      Nombre de colis *{' '}
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type='number'
                      min='1'
                      max='9999'
                      value={product.numberOfBox || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (val >= 1 && val <= 9999) {
                          onUpdate(index, 'numberOfBox', val)
                        } else {
                          onUpdate(index, 'numberOfBox', e.target.value)
                        }
                      }}
                      placeholder='1-9999'
                      className={
                        product.numberOfBox && product.numberOfBox >= 1
                          ? styles.valid
                          : ''
                      }
                    />
                  </div>
                </div>

                <div className={styles.grid2}>
                  {/* Prix unitaire */}
                  <div
                    className={`${styles.field} ${!product.prix || product.prix <= 0 ? styles.fieldError : ''}`}
                  >
                    <label>
                      Prix unitaire * <span className={styles.required}>*</span>
                    </label>
                    <input
                      type='number'
                      step='0.01'
                      min='0.01'
                      value={product.prix || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        if (val >= 0.01) {
                          onUpdate(index, 'prix', val)
                        } else {
                          onUpdate(index, 'prix', e.target.value)
                        }
                      }}
                      placeholder='> 0'
                      className={
                        product.prix && product.prix > 0 ? styles.valid : ''
                      }
                    />
                  </div>

                  {/* Prix total (auto-calculé) */}
                  <div className={styles.field}>
                    <label>Prix total</label>
                    <input
                      type='number'
                      value={product.prixTotal || 0}
                      readOnly
                      className={styles.readonly}
                    />
                  </div>
                </div>

                {/* Devise */}
                <div className={styles.field}>
                  <label>
                    Devise * <span className={styles.required}>*</span>
                  </label>
                  <select
                    value={product.devise || 'EUR'}
                    onChange={(e) => onUpdate(index, 'devise', e.target.value)}
                    className={product.devise ? styles.valid : ''}
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

                {/* Photo */}
                <div className={styles.field}>
                  <label>Photo du produit</label>
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
                  disabled={products.length === 1}
                >
                  🗑️ Supprimer ce produit
                </button>
              </div>
            )
          })}

          <div className={styles.btnContainer}>
            <button type='button' className={styles.addBtn} onClick={onAdd}>
              ➕ Ajouter un produit
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

              {/* ✅ INCOTERM - SANS "Sélectionner" */}
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

ProductForm.displayName = 'ProductForm'

export default ProductForm
