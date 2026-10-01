import React, { useState } from 'react'
import styles from '../../styles/GuideRenderer.module.css'

// ===============================
//  UTILITAIRE : RENDU DE CONTENU MIXTE
// ===============================
const renderMixedContent = (content) => {
  if (content === null || content === undefined) return null
  if (typeof content === 'string') return content
  if (typeof content === 'number') return content.toString()

  // Si c'est un objet, on gère les cas connus
  if (typeof content === 'object' && !Array.isArray(content)) {
    // Cas { item, subItems } (éventuellement avec _id)
    if (content.item) {
      return (
        <div>
          <span>{content.item}</span>
          {content.subItems &&
            Array.isArray(content.subItems) &&
            content.subItems.length > 0 && (
              <ul className={styles.subItemList}>
                {content.subItems.map((sub, idx) => (
                  <li key={idx}>{renderMixedContent(sub)}</li>
                ))}
              </ul>
            )}
        </div>
      )
    }
    // Si l'objet a un champ 'text' (ex: remark)
    if (content.text) {
      return content.text
    }
    // Autre objet : on le convertit en chaîne JSON pour éviter l'erreur
    console.warn('Objet non reconnu dans le rendu :', content)
    return JSON.stringify(content)
  }

  // Si c'est un tableau, on récure
  if (Array.isArray(content)) {
    return content.map((item, idx) => (
      <React.Fragment key={idx}>{renderMixedContent(item)}</React.Fragment>
    ))
  }

  return String(content)
}

// ===============================
//  SOUS‑COMPOSANT : TABLEAU DE TAXES
// ===============================
const TaxTable = ({ data, title }) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null

  const headers = Object.keys(data[0])

  return (
    <div className={styles.tableWrapper}>
      {title && <h4 className={styles.tableTitle}>{title}</h4>}
      <table className={styles.taxTable}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header.replace(/_/g, ' ').toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {headers.map((header) => (
                <td key={header}>
                  {typeof row[header] === 'boolean'
                    ? row[header]
                      ? '✔ Oui'
                      : '❌ Non'
                    : renderMixedContent(row[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ===============================
//  SOUS‑COMPOSANT : REMARQUES
// ===============================
const Remark = ({ remark }) => {
  if (!remark || !Array.isArray(remark) || remark.length === 0) return null

  return (
    <div className={styles.remarkContainer}>
      {remark.map((item, idx) => {
        const typeClass =
          item.type === 'warning'
            ? styles.remarkWarning
            : item.type === 'success'
              ? styles.remarkSuccess
              : styles.remarkInfo

        return (
          <div key={idx} className={`${styles.remarkItem} ${typeClass}`}>
            <div className={styles.remarkText}>
              {renderMixedContent(item.text)}
            </div>
            {item.details && item.details.list && (
              <ul className={styles.remarkDetails}>
                {item.details.list.map((li, i) => (
                  <li key={i}>{renderMixedContent(li)}</li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ===============================
//  SOUS‑COMPOSANT : ÉTAPES (STEPS)
// ===============================
const Steps = ({ steps }) => {
  if (!steps || !Array.isArray(steps) || steps.length === 0) return null

  return (
    <div className={styles.stepsContainer}>
      {steps.map((step, idx) => (
        <div key={idx} className={styles.step}>
          <div className={styles.stepNumber}>{step.number}</div>
          <div className={styles.stepContent}>
            <h4 className={styles.stepTitle}>{step.title}</h4>

            {step.instructions &&
              Array.isArray(step.instructions) &&
              step.instructions.length > 0 && (
                <ul className={styles.stepInstructions}>
                  {step.instructions.map((instr, i) => (
                    <li key={i}>{renderMixedContent(instr)}</li>
                  ))}
                </ul>
              )}

            {step.description && (
              <div className={styles.stepDescription}>
                {Array.isArray(step.description) ? (
                  step.description.map((d, i) => (
                    <div key={i}>{renderMixedContent(d)}</div>
                  ))
                ) : (
                  <div>{renderMixedContent(step.description)}</div>
                )}
              </div>
            )}

            {step.scenarios &&
              Array.isArray(step.scenarios) &&
              step.scenarios.length > 0 && (
                <div className={styles.scenarios}>
                  {step.scenarios.map((sc, i) => (
                    <div key={i} className={styles.scenario}>
                      <h5>{sc.title}</h5>
                      <ul>
                        {sc.steps.map((s, j) => (
                          <li key={j}>{renderMixedContent(s)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ===============================
//  COMPOSANT PRINCIPAL
// ===============================
const GuideRenderer = ({ data, error }) => {
  const [lightboxImage, setLightboxImage] = useState(null)
  const [lightboxCaption, setLightboxCaption] = useState('')

  if (error) return <div className={styles.error}>Erreur : {error}</div>
  if (!data) return <div className={styles.loading}>Chargement…</div>

  // Si data est un tableau, on considère qu'il s'agit directement des sections
  console.log('DATA COMPLETE:', data)

  const isArrayData = Array.isArray(data)

  const guideTitle = isArrayData ? null : data?.title
  const guideImage = isArrayData ? null : data?.image

  const sections = isArrayData
    ? data
    : Array.isArray(data?.sections)
      ? data.sections
      : []

  console.log('IS ARRAY:', isArrayData)
  console.log('DATA TITLE:', guideTitle)
  console.log('DATA IMAGE:', guideImage)
  console.log('DATA SECTIONS:', sections)

  if (sections.length === 0) {
    return <div className={styles.empty}>Aucune donnée disponible</div>
  }

  // ✅ Fonction pour ouvrir la lightbox
  const openLightbox = (imageUrl, caption) => {
    if (!imageUrl) return
    const url = imageUrl.startsWith('http')
      ? imageUrl
      : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imageUrl}`
    setLightboxImage(url)
    setLightboxCaption(caption || 'Image')
  }

  // ✅ Fermer la lightbox
  const closeLightbox = () => {
    setLightboxImage(null)
    setLightboxCaption('')
  }

  // ✅ Fonction pour afficher les images
  const getImageUrl = (image) => {
    if (!image) return ''

    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image
    }

    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${image}`
  }

  const renderImages = (images) => {
    if (!Array.isArray(images) || images.length === 0) {
      return null
    }

    return (
      <div className={styles.imagesGrid}>
        {images.map((image, index) => {
          const imageUrl = getImageUrl(image)

          return (
            <div
              key={index}
              className={styles.imageWrapper}
              onClick={() =>
                openLightbox(imageUrl, `Illustration ${index + 1}`)
              }
            >
              <img
                src={imageUrl}
                alt={`Illustration ${index + 1}`}
                loading='lazy'
                onError={(e) => {
                  console.error('Image impossible à charger:', imageUrl)
                  e.currentTarget.src = '/placeholder-image.png'
                }}
              />

              <div className={styles.imageOverlay}>
                <span className={styles.imageZoom}>🔍</span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* En-tête du guide */}
      {!isArrayData && (guideTitle || guideImage) && (
        <header className={styles.guideHeader}>
          {guideImage && (
            <img
              src={getImageUrl(guideImage)}
              alt={guideTitle || 'Illustration du guide'}
              className={styles.guideImage}
            />
          )}

          {guideTitle && <h1 className={styles.guideTitle}>{guideTitle}</h1>}
        </header>
      )}

      {sections.map((section, idx) => (
        <section key={idx} className={styles.section} id={section.anchor}>
          {/* TAB2 IMAGE*/}
          {section.image && (
            <div className={styles.mainImageWrapper}>
              <img
                src={getImageUrl(section.image)}
                alt={section.title || 'Illustration'}
                className={styles.mainImage}
                onError={(e) => {
                  console.error(
                    'Image impossible à charger:',
                    getImageUrl(section.image),
                  )
                  e.currentTarget.src = '/placeholder-image.png'
                }}
              />
            </div>
          )}
          {/* TAB2 Title*/}
          <h1 className={styles.sectionTitle}>
            {renderMixedContent(section.title)}
          </h1>

          {section.description && (
            <div className={styles.sectionDescription}>
              {renderMixedContent(section.description)}
            </div>
          )}

          {section.remark && <Remark remark={section.remark} />}
          {section.tax_table && (
            <TaxTable data={section.tax_table} title='Taxes applicables' />
          )}

          {section.vehicle_tax_tables && (
            <div className={styles.vehicleTaxTables}>
              {section.vehicle_tax_tables.neuf && (
                <TaxTable
                  data={section.vehicle_tax_tables.neuf.taxes}
                  title={section.vehicle_tax_tables.neuf.title}
                />
              )}
              {section.vehicle_tax_tables.occasion && (
                <TaxTable
                  data={section.vehicle_tax_tables.occasion.taxes}
                  title={section.vehicle_tax_tables.occasion.title}
                />
              )}
            </div>
          )}
          {section.steps && <Steps steps={section.steps} />}
          {section.subsections &&
            Array.isArray(section.subsections) &&
            section.subsections.length > 0 && (
              <div className={styles.subsections}>
                {section.subsections.map((sub, subIdx) => (
                  <div
                    key={subIdx}
                    className={styles.subsection}
                    id={sub.anchor || `sub-${subIdx}`}
                  >
                    <h3 className={styles.subsectionTitle}>
                      {renderMixedContent(sub.title)}
                    </h3>

                    {sub.description && (
                      <div className={styles.subsectionDescription}>
                        {renderMixedContent(sub.description)}
                      </div>
                    )}

                    {sub.remark && <Remark remark={sub.remark} />}

                    {sub.tax_table && (
                      <TaxTable
                        data={sub.tax_table}
                        title='Taxes applicables'
                      />
                    )}

                    {sub.vehicle_tax_tables && (
                      <div className={styles.vehicleTaxTables}>
                        {sub.vehicle_tax_tables.neuf && (
                          <TaxTable
                            data={sub.vehicle_tax_tables.neuf.taxes}
                            title={sub.vehicle_tax_tables.neuf.title}
                          />
                        )}
                        {sub.vehicle_tax_tables.occasion && (
                          <TaxTable
                            data={sub.vehicle_tax_tables.occasion.taxes}
                            title={sub.vehicle_tax_tables.occasion.title}
                          />
                        )}
                      </div>
                    )}

                    {sub.steps && <Steps steps={sub.steps} />}

                    {/* TAB1 IMAGE*/}
                    {sub.images &&
                      Array.isArray(sub.images) &&
                      sub.images.length > 0 &&
                      renderImages(sub.images)}

                    {sub.items &&
                      Array.isArray(sub.items) &&
                      sub.items.length > 0 && (
                        <ul className={styles.itemsList}>
                          {sub.items.map((item, i) => (
                            <li key={i} className={styles.item}>
                              {renderMixedContent(item)}
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                ))}
              </div>
            )}
          {idx < sections.length - 1 && <hr className={styles.divider} />}
        </section>
      ))}

      {lightboxImage && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <span className={styles.lightboxClose}>&times;</span>
          <img
            className={styles.lightboxImage}
            src={lightboxImage}
            alt={lightboxCaption}
          />
          {lightboxCaption && (
            <div className={styles.lightboxCaption}>{lightboxCaption}</div>
          )}
        </div>
      )}
    </div>
  )
}

export default GuideRenderer
