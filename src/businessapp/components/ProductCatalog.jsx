import React, { useState } from 'react'
import styles from '../../styles/ProductCatalog.module.css'

const ProductCatalog = ({ data, error, onImageClick }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedMenu, setSelectedMenu] = useState('all')

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return <div>Aucun produit disponible</div>
  }

  // Filtrer les produits
  const getFilteredProducts = () => {
    let products = []
    Object.entries(data).forEach(([category, menus]) => {
      Object.entries(menus).forEach(([menu, items]) => {
        if (Array.isArray(items)) {
          items.forEach((item) => {
            products.push({
              ...item,
              categorie: category,
              menu: menu === '_no_menu_' ? null : menu,
            })
          })
        }
      })
    })

    if (selectedCategory !== 'all') {
      products = products.filter((p) => p.categorie === selectedCategory)
    }
    if (selectedCategory !== 'all' && selectedMenu !== 'all') {
      products = products.filter((p) => p.menu === selectedMenu)
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      products = products.filter((p) => p.name?.toLowerCase().includes(term))
    }
    return products
  }

  const filteredProducts = getFilteredProducts()
  const categories = Object.keys(data)
  const menus =
    selectedCategory !== 'all' && data[selectedCategory]
      ? Object.keys(data[selectedCategory]).filter((m) => m !== '_no_menu_')
      : []

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.filters}>
        <input
          type='text'
          className={styles.search}
          placeholder='Rechercher un produit...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className={styles.filterSelect}
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value)
            setSelectedMenu('all')
          }}
        >
          <option value='all'>Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {selectedCategory !== 'all' && menus.length > 0 && (
          <select
            className={styles.filterSelect}
            value={selectedMenu}
            onChange={(e) => setSelectedMenu(e.target.value)}
          >
            <option value='all'>Tous les menus</option>
            {menus.map((menu) => (
              <option key={menu} value={menu}>
                {menu}
              </option>
            ))}
          </select>
        )}
      </div>

      <ProductList products={filteredProducts} onImageClick={onImageClick} />
    </div>
  )
}

const ProductList = ({ products, onImageClick }) => {
  if (!products || products.length === 0) {
    return <div className={styles.empty}>Aucun produit trouvé</div>
  }

  const grouped = {}
  products.forEach((product) => {
    const cat = product.categorie || 'Autres'
    if (!grouped[cat]) grouped[cat] = {}
    const menu = product.menu || '_no_menu_'
    if (!grouped[cat][menu]) grouped[cat][menu] = []
    grouped[cat][menu].push(product)
  })

  return (
    <div className={styles.catalog}>
      {Object.entries(grouped).map(([category, menus]) => (
        <div key={category} className={styles.category}>
          <h2 className={styles.categoryTitle}>{category}</h2>
          {Object.entries(menus).map(([menu, items]) => (
            <div key={menu} className={styles.menuBlock}>
              {menu !== '_no_menu_' && (
                <h3 className={styles.menuTitle}>{menu}</h3>
              )}
              <div className={styles.productList}>
                {items.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    onImageClick={onImageClick}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const ProductCard = ({ product, onImageClick }) => {
  const [page, setPage] = useState(1)
  const images = product.image || []
  const itemsPerPage = 12
  const totalPages = Math.ceil(images.length / itemsPerPage)
  const start = (page - 1) * itemsPerPage
  const end = Math.min(start + itemsPerPage, images.length)
  const currentImages = images.slice(start, end)
  const [lightbox, setLightbox] = useState(null)
  const [lightboxCaption, setLightboxCaption] = useState('')

  const openLightbox = (url, caption) => {
    const imgUrl =
      url?.startsWith('http') ||
      url?.startsWith('/assets') ||
      url?.startsWith('/public')
        ? url
        : `http://localhost:5000${url}`
    setLightbox(imgUrl)
    setLightboxCaption(caption || product.name)
  }

  const closeLightbox = () => {
    setLightbox(null)
    setLightboxCaption('')
  }

  if (images.length === 0) return null

  return (
    <div className={styles.productCard}>
      <div className={styles.productName}>{product.name}</div>
      <div className={styles.imageGrid}>
        {currentImages.map((img, idx) => (
          <div
            key={idx}
            className={styles.imageWrapper}
            onClick={() =>
              openLightbox(img.url, img.description || product.name)
            }
          >
            <img
              src={`http://localhost:5000${img.url}`}
              alt={img.description || product.name}
              loading='lazy'
            />
            <div className={styles.meta}>
              {img.description && (
                <span className={styles.desc}>{img.description}</span>
              )}
              {img.price && <span className={styles.price}>{img.price}</span>}
              {product.reference && (
                <span className={styles.ref}>Réf: {product.reference}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ← Précédent
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant →
          </button>
        </div>
      )}

      {lightbox && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <div className={styles.lightboxContent}>
            <button className={styles.lightboxClose} onClick={closeLightbox}>
              ×
            </button>
            <img src={lightbox} alt={lightboxCaption} />
            {lightboxCaption && (
              <div className={styles.lightboxCaption}>{lightboxCaption}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductCatalog
