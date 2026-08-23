import React, { useState } from 'react'
import styles from '../../styles/GuideRenderer.module.css'

const GuideRenderer = ({ data, error }) => {
  const [lightboxImage, setLightboxImage] = useState(null)
  const [lightboxCaption, setLightboxCaption] = useState('')

  // Gestion des erreurs
  if (error) {
    return (
      <div className={styles.error}>
        <span className={styles.errorIcon}>❌</span>
        {typeof error === 'string' ? error : 'Une erreur est survenue'}
      </div>
    )
  }

  // Pas de données
  if (!data) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Chargement du guide...</p>
      </div>
    )
  }

  // Vérification des données
  const chapters = Array.isArray(data) ? data : data?.chapters || [data]
  console.log('CAHPTERS:', chapters)

  if (chapters.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>📖</span>
        <p>Aucun chapitre disponible</p>
      </div>
    )
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

  // ✅ Fonction pour afficher les remarques
  const renderRemark = (remarks) => {
    if (!remarks || remarks.length === 0) return null

    return (
      <div className={'styles.remarksContainer'}>
        {remarks.map((remark, index) => (
          <div
            key={index}
            className={`${'styles.remark'} ${styles[`remark-${remark.type}`]}`}
          >
            <span className={styles.remarkIcon}>
              {remark.type === 'info' && 'ℹ️'}
              {remark.type === 'warning' && '⚠️'}
              {remark.type === 'success' && '✅'}
            </span>
            <span className={'styles.remarkText'}>{remark.text}</span>
          </div>
        ))}
      </div>
    )
  }

  // ✅ Fonction pour afficher les étapes
  const renderSteps = (steps) => {
    if (!steps || steps.length === 0) return null

    return (
      <div className={styles.stepsContainer}>
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>{step.number}</span>
              <h5 className={styles.stepTitle}>{step.title}</h5>
            </div>

            {step.instructions?.length > 0 && (
              <ul className={styles.stepInstructions}>
                {step.instructions.map((instruction, i) => (
                  <li
                    key={i}
                    dangerouslySetInnerHTML={{ __html: instruction }}
                  />
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }

  // ✅ Fonction pour afficher les images
  const renderImages = (images) => {
    if (!images || images.length === 0) return null

    return (
      <div className={styles.imagesGrid}>
        {images.map((image, index) => (
          <div
            key={index}
            className={styles.imageWrapper}
            onClick={() => openLightbox(image, `Illustration ${index + 1}`)}
          >
            <img
              src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${image}`}
              alt={`Illustration ${index + 1}`}
              loading='lazy'
              onError={(e) => {
                e.target.src = '/placeholder-image.png'
              }}
            />
            <div className={styles.imageOverlay}>
              <span className={styles.imageZoom}>🔍</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ✅ Fonction pour afficher une citation
  const renderQuote = (quote) => {
    if (!quote) return null
    return (
      <blockquote className={styles.quote}>
        <span className={styles.quoteIcon}>“</span>
        <span dangerouslySetInnerHTML={{ __html: quote }} />
        <span className={styles.quoteIcon}>”</span>
      </blockquote>
    )
  }

  // ✅ Fonction pour afficher un tableau
  const renderTable = (table) => {
    if (!table) return null
    return (
      <div className={styles.tableContainer}>
        <div dangerouslySetInnerHTML={{ __html: table }} />
      </div>
    )
  }

  // ✅ Fonction pour afficher une vidéo
  const renderVideo = (video) => {
    if (!video) return null
    return (
      <div className={styles.videoContainer}>
        <div dangerouslySetInnerHTML={{ __html: video }} />
      </div>
    )
  }

  // ✅ Fonction pour afficher du code
  const renderCode = (code) => {
    if (!code) return null
    return (
      <div className={styles.codeContainer}>
        <pre className={styles.codeBlock}>
          <code>{code}</code>
        </pre>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {chapters.map((chapter, chapterIndex) => (
        <div key={chapterIndex} className={styles.chapter}>
          {/* Titre du chapitre */}
          <h2 className={styles.chapterTitle}>{chapter.title}</h2>

          {/* Description */}
          {chapter.description && (
            <div
              className={styles.chapterDescription}
              dangerouslySetInnerHTML={{ __html: chapter.description }}
            />
          )}

          {/* Images */}
          {chapter.images && renderImages(chapter.images)}

          {/* Remarques */}
          {chapter.remark && renderRemark(chapter.remark)}

          {/* Étapes */}
          {chapter.steps && renderSteps(chapter.steps)}

          {/* Citation */}
          {chapter.quote && renderQuote(chapter.quote)}

          {/* Tableau */}
          {chapter.table && renderTable(chapter.table)}

          {/* Vidéo */}
          {chapter.video && renderVideo(chapter.video)}

          {/* Code */}
          {chapter.code && renderCode(chapter.code)}

          {/* Séparateur entre chapitres */}
          {chapterIndex < chapters.length - 1 && (
            <hr className={styles.chapterDivider} />
          )}
        </div>
      ))}

      {/* Lightbox */}
      {lightboxImage && (
        <div className={styles.lightboxOverlay} onClick={closeLightbox}>
          <div className={styles.lightboxContent}>
            <button
              className={styles.lightboxClose}
              onClick={(e) => {
                e.stopPropagation()
                closeLightbox()
              }}
            >
              ×
            </button>
            <img
              src={lightboxImage}
              alt={lightboxCaption}
              className={styles.lightboxImage}
            />
            {lightboxCaption && (
              <div className={styles.lightboxCaption}>{lightboxCaption}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GuideRenderer
