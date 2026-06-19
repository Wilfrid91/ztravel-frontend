import styles from '../css/GuideRenderer.module.css'
import { React, useState } from 'react'

export default function GuideRenderer({ data, error }) {
  const [lightboxImage, setLightboxImage] = useState(null)
  const [lightboxAlt, setLightboxAlt] = useState('')

  const openLightbox = (src, alt) => {
    setLightboxImage(src)
    setLightboxAlt(alt || 'Image')
  }

  const closeLightbox = () => {
    setLightboxImage(null)
    setLightboxAlt('')
  }

  if (!data || data.length === 0) {
    console.log('Aucune donnée à afficher:', data)
    return <div className={styles.guideContainer}>Aucun chapitre trouvé.</div>
  }

  // Fonction pour rendre les remarques
  const renderRemark = (remark) => {
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      success: '😄',
    }

    return (
      <div key={remark.text} style={{ marginBottom: '12px' }}>
        <span style={{ marginRight: '8px' }}>{icons[remark.type] || '💡'}</span>
        <div
          style={{ display: 'inline' }}
          dangerouslySetInnerHTML={{ __html: remark.text }}
        />

        {remark.details && (
          <div style={{ marginTop: '12px' }}>
            {remark.details.title && <h3>{remark.details.title}</h3>}

            {remark.details.list?.length > 0 && (
              <ol
                style={{
                  lineHeight: '1.8',
                  fontSize: '16px',
                  paddingLeft: '20px',
                }}
              >
                {remark.details.list.map((item, index) => (
                  <li key={index}>
                    {item.item}

                    {item.subItems?.length > 0 && (
                      <ul
                        style={{
                          marginTop: '6px',
                          paddingLeft: '20px',
                          fontSize: '15px',
                          color: '#666',
                        }}
                      >
                        {item.subItems.map((subItem, subIndex) => (
                          <li
                            key={subIndex}
                            dangerouslySetInnerHTML={{ __html: subItem.text }}
                          />
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'SF Pro Display, sans-serif' }}>
      {error && <div className='error-message'>{error}</div>}
      {console.log('DATA REÇU :', data)}
      {data.forEach((item, i) => console.log('Index', i, '=', item))}

      <main>
        {data.map((chapter, index) => (
          <div key={index} style={{ marginBottom: '40px' }}>
            {/* Titre du chapitre */}
            <h2>{chapter.title}</h2>

            {/* Description */}
            {chapter.description && (
              <div dangerouslySetInnerHTML={{ __html: chapter.description }} />
            )}

            {/* Images avec clic pour zoom */}
            {chapter.images?.length > 0 && (
              <div
                className={styles.imageGrid}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  margin: '20px 0',
                }}
              >
                {chapter.images.map((img, imgIndex) => (
                  <div
                    key={imgIndex}
                    className={styles.imageWrapper}
                    onClick={() =>
                      openLightbox(img, `Illustration ${imgIndex + 1}`)
                    }
                    style={{
                      cursor: 'pointer',
                      overflow: 'hidden',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)'
                      e.currentTarget.style.boxShadow =
                        '0 8px 24px rgba(0,0,0,0.12)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(0,0,0,0.06)'
                    }}
                  >
                    <img
                      src={img}
                      alt={`Illustration ${imgIndex + 1}`}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Remarques */}
            {Array.isArray(chapter.remark) && chapter.remark.length > 0 && (
              <div
                style={{
                  backgroundColor: '#fff8e1',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  margin: '15px 0',
                  borderLeft: '4px solid #ffc107',
                }}
              >
                {/*<strong>⚠️ Remarques :</strong> */}
                <div style={{ marginTop: '8px' }}>
                  {chapter.remark.map(renderRemark)}
                </div>
              </div>
            )}
            {/* Étapes */}
            {Array.isArray(chapter.steps) && chapter.steps.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3>Étapes</h3>

                {chapter.steps.map((step, stepIndex) => (
                  <div key={stepIndex} style={{ marginBottom: '20px' }}>
                    <h4
                      dangerouslySetInnerHTML={{
                        __html: `${step.number}. ${step.title}`,
                      }}
                    />

                    {Array.isArray(step.instructions) &&
                      step.instructions.map((instruction, instIndex) => (
                        <p
                          key={instIndex}
                          style={{ lineHeight: '1.6' }}
                          dangerouslySetInnerHTML={{ __html: instruction }}
                        />
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </main>
      {/* LIGHTBOX (overlay de zoom) */}
      {lightboxImage && (
        <div
          className={styles.lightboxOverlay}
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer',
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90%',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeLightbox()
              }}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '40px',
                cursor: 'pointer',
                padding: '0 10px',
                lineHeight: '1',
              }}
            >
              ×
            </button>
            <img
              src={lightboxImage}
              alt={lightboxAlt}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            />
            {lightboxAlt && (
              <div
                style={{
                  color: 'white',
                  textAlign: 'center',
                  marginTop: '16px',
                  fontSize: '16px',
                  fontWeight: '400',
                  opacity: 0.8,
                }}
              >
                {lightboxAlt}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
