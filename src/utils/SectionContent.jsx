import React, { useState } from 'react'

/**
 * dangerouslySetInnerHTML permet d’interpréter les balises HTML dans une string.
 * @param {*} text
 * @returns
 */
function renderWithNewLines(text) {
  if (!text) return null

  const lines = text.split('\n')

  return lines.map((line, i) => (
    <span key={i} dangerouslySetInnerHTML={{ __html: line }}></span>
  ))
}

/**
 * Affiche le contenu d'une section ou sous-section (description, remarques, images, étapes, etc.).
 * @param {*} content
 * @returns
 */
const SectionContent = ({ content }) => {
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

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        {/* Description */}
        {content.description && (
          <div
            dangerouslySetInnerHTML={{ __html: content.description }}
            style={{ marginBottom: '15px', lineHeight: '1.6' }}
          />
        )}

        {/* Remarques */}
        {Array.isArray(content.remark) && content.remark.length > 0 && (
          <div
            style={{
              backgroundColor: '#fff8e1',
              padding: '10px 15px',
              borderRadius: '5px',
              margin: '15px 0',
              borderLeft: '4px solid #ffc107',
            }}
          >
            {/*<strong>⚠️ Remarque :</strong>*/}
            <ul
              style={{
                margin: '5px 0 0 0',
                paddingLeft: '20px',
                listStyle: 'none',
              }}
            >
              {content.remark.map((remark, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: remark }} />
              ))}
            </ul>
          </div>
        )}

        {/* Images avec clic pour zoom */}
        {content.images && content.images.length > 0 && (
          <div
            style={{
              margin: '20px 0',
              display: 'grid',
              gridTemplateColumns:
                content.images.length === 1 ? '1fr' : 'repeat(2, 1fr)',
              gap: '16px',
            }}
          >
            {content.images.map((img, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => openLightbox(img, `Illustration ${index + 1}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 8px 24px rgba(0,0,0,0.12)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(0,0,0,0.06)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <img
                  src={img}
                  alt={`Illustration ${index + 1}`}
                  style={{
                    width: '25%',
                    height: 'auto',
                    aspectRatio: '4 / 3',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                {content.imageCaptions && content.imageCaptions[index] && (
                  <div
                    style={{
                      padding: '8px 12px',
                      fontSize: '14px',
                      color: '#555',
                      backgroundColor: '#fff',
                      borderTop: '1px solid #eee',
                    }}
                  >
                    {content.imageCaptions[index]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Étapes */}
        {content.steps && (
          <div style={{ margin: '20px 0' }}>
            <h4 style={{ color: '#333', marginBottom: '10px' }}>Étapes :</h4>
            <ol style={{ paddingLeft: '20px' }}>
              {content.steps.map((step) => (
                <li key={step.number} style={{ marginBottom: '15px' }}>
                  <h5 style={{ color: '#444', marginBottom: '5px' }}>
                    {step.title}
                  </h5>
                  <ul style={{ paddingLeft: '20px', marginTop: '0' }}>
                    {step.instructions.map((instruction, index) => (
                      <li key={index} style={{ marginBottom: '5px' }}>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Liste simple */}
        {content.items && (
          <div style={{ margin: '20px 0' }}>
            <ul style={{ paddingLeft: '20px' }}>
              {content.items.map((item, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
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
          }}
          onClick={closeLightbox}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90%',
            }}
          >
            <img
              src={lightboxImage}
              alt={lightboxAlt}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            />
            <button
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
              }}
              onClick={(e) => {
                e.stopPropagation()
                closeLightbox()
              }}
            >
              ×
            </button>
            {lightboxAlt && (
              <div
                style={{
                  color: 'white',
                  textAlign: 'center',
                  marginTop: '12px',
                  fontSize: '16px',
                }}
              >
                {lightboxAlt}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default SectionContent
