import { useState } from 'react'
import styles from '../css/catalog.module.css'

export function ProductCatalog({ data }) {
  if (!Array.isArray(data) || data.length === 0) return null

  //console.log('export function ProductCatalog({ data }) {', data)

  // Regrouper par catégorie/menu
  const grouped = data.reduce((acc, product) => {
    const { categorie, menu, name, image = [] } = product
    if (!acc[categorie]) acc[categorie] = {}
    console.log('acc[categorie]', acc[categorie])
    const menuKey = menu || '_no_menu_'
    if (!acc[categorie][menuKey]) acc[categorie][menuKey] = []
    acc[categorie][menuKey].push({ name, image }) // image est un tableau d'objets
    return acc
  }, {})

  console.log(' grouped', grouped)
  return (
    <div className={styles.notionCatalogue}>
      {Object.entries(grouped).map(([categorie, menus]) => (
        <div key={categorie} className={styles.notionCategory}>
          <h2 className={styles.notionCategoryTitle}>{categorie}</h2>

          {Object.entries(menus).map(([menu, produits]) => (
            <MenuBlock key={menu} menu={menu} produits={produits} />
          ))}
        </div>
      ))}
    </div>
  )
}

// Composant pour un menu (regroupe plusieurs produits)
function MenuBlock({ menu, produits }) {
  return (
    <div className={styles.notionMenuBlock}>
      {menu !== '_no_menu_' && (
        <h3 className={styles.notionMenuTitle}>{menu}</h3>
      )}

      <div className={styles.notionList}>
        {produits.map((p, idx) => (
          <ProductItem key={idx} product={p} />
        ))}
      </div>
    </div>
  )
}

// Composant pour un produit (avec sa propre pagination)
function ProductItem({ product }) {
  const [page, setPage] = useState(1)
  const IMAGES_PER_PAGE = 12 // Pagination : nombre d’images par page
  const { name, image } = product
  const totalImages = image.length
  const totalPages = Math.ceil(totalImages / IMAGES_PER_PAGE)
  const start = (page - 1) * IMAGES_PER_PAGE
  const end = Math.min(start + IMAGES_PER_PAGE, totalImages)
  const currentImages = image.slice(start, end)

  // Lightbox
  const [lightboxImage, setLightboxImage] = useState(null)
  const [lightboxName, setLightboxName] = useState('')

  const openLightbox = (url, name) => {
    setLightboxImage(url)
    setLightboxName(name)
  }

  const closeLightbox = () => {
    setLightboxImage(null)
    setLightboxName('')
  }

  if (totalImages === 0) return null

  return (
    <>
      <div className={styles.notionListItem}>
        <div className={styles.notionContent}>
          <div className={styles.notionTitle}>{name}</div>

          <div className={styles.productImages}>
            {currentImages.map((item, idx) => (
              <div key={idx} className={styles.productImageWrapper}>
                <img
                  src={item.url}
                  alt={item.description || name}
                  className={styles.notionImage}
                  onClick={() => openLightbox(item.url, name)}
                  loading='lazy'
                />
                <div className={styles.productMeta}>
                  <span className={styles.description}>{item.description}</span>
                  <span className={styles.price}>{item.price}</span>
                  {item.reference && (
                    <span className={styles.reference}>
                      Réf: {item.reference}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                ← Précédent
              </button>
              <span>
                Page {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className={styles.lightboxOverlay} onClick={closeLightbox}>
          <div className={styles.lightboxContent}>
            <button className={styles.lightboxClose} onClick={closeLightbox}>
              ×
            </button>
            <img
              src={lightboxImage}
              alt={lightboxName}
              className={styles.lightboxImage}
            />
            <div className={styles.lightboxCaption}>{lightboxName}</div>
          </div>
        </div>
      )}
    </>
  )
}
