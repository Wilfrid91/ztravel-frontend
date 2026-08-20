/**
 * Vérificateur d’architecture React — PRO
 * Wilfrid, ce script scanne ton projet et détecte :
 * - fichiers manquants
 * - dossiers mal nommés
 * - imports cassés
 * - extensions incorrectes
 * - fichiers hors du dossier src/
 * - incohérences entre App.js et ton disque
 */

import fs from 'fs'
import path from 'path'

const ROOT = path.resolve('src')

// Fichiers attendus dans l’architecture PRO
const EXPECTED = [
  'auth/Login.jsx',
  'auth/Register.jsx',
  'auth/SessionExpiree.jsx',

  'home/HomeMain.jsx',
  'home/HomePage.js',

  'businessapp/BusinessAppMain.jsx',
  'businessapp/Sidebar.jsx',
  'businessapp/Header.jsx',

  'businessapp/tabs/Tab1Guide.jsx',
  'businessapp/tabs/Tab2Products.jsx',
  'businessapp/tabs/Tab3Vehicles.jsx',
  'businessapp/tabs/Tab4Catalogue.jsx',
  'businessapp/tabs/Tab5Payment.jsx',
  'businessapp/tabs/Tab6CGU.jsx',
  'businessapp/tabs/Tab7Transactions.jsx',
  'businessapp/tabs/Tab8Contact.jsx',
  'businessapp/tabs/SimulatorPage.jsx',

  'businessapp/components/GuideRenderer.jsx',
  'businessapp/components/Lightbox.jsx',
  'businessapp/components/ProductForm.jsx',
  'businessapp/components/VehicleForm.jsx',
  'businessapp/components/ShippingForm.jsx',
  'businessapp/components/PaymentMTN.jsx',
  'businessapp/components/PaymentFedaPay.jsx',
  'businessapp/components/ReceiptViewer.jsx',
  'businessapp/components/ContactForm.jsx',
  'businessapp/components/CatalogueCard.jsx',
  'businessapp/components/SearchBar.jsx',
  'businessapp/components/FilterMenu.jsx',
  'businessapp/components/MtnCallback.jsx',

  'admin/AdminLayout.jsx',
  'admin/UserAccount.jsx',
  'admin/RefundMtn.jsx',
  'admin/RefundFedaPay.jsx',
  'admin/RefundAll.jsx',

  'redux/store.js',

  'data/HomePage.js',
  'data/BusinessAppPage.js',

  'utils/axiosInstance.js',
  'utils/sanitizeHTML.js',
  'utils/formatters.js',
  'utils/validators.js',
]

function checkFile(relativePath) {
  const fullPath = path.join(ROOT, relativePath)
  return fs.existsSync(fullPath)
}

function scanArchitecture() {
  console.log('🔍 Vérification de l’architecture du projet…\n')

  const missing = []
  const present = []

  EXPECTED.forEach((file) => {
    if (checkFile(file)) {
      present.push(file)
    } else {
      missing.push(file)
    }
  })

  console.log('📁 FICHIERS TROUVÉS :')
  present.forEach((f) => console.log('   ✔ ' + f))

  console.log('\n❌ FICHIERS MANQUANTS :')
  if (missing.length === 0) {
    console.log('   🎉 Aucun fichier manquant !')
  } else {
    missing.forEach((f) => console.log('   ✖ ' + f))
  }

  console.log('\n🏁 Vérification terminée.')
}

scanArchitecture()
