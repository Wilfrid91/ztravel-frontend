/**
 * Script PRO — Auto-Fix Architecture React
 * Wilfrid, ce script :
 * - détecte les fichiers manquants
 * - détecte les dossiers manquants
 * - crée automatiquement les dossiers
 * - crée automatiquement les fichiers vides
 * - génère un rapport clair
 */

import fs from 'fs'
import path from 'path'

const ROOT = path.resolve('src')

// Architecture PRO attendue
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

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log('📁 Dossier créé :', dirPath)
  }
}

function ensureFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '// Fichier généré automatiquement\n')
    console.log('📄 Fichier créé :', filePath)
  }
}

function autoFixArchitecture() {
  console.log('🔧 Auto-Fix Architecture React — PRO\n')

  EXPECTED.forEach((relativePath) => {
    const fullPath = path.join(ROOT, relativePath)
    const dir = path.dirname(fullPath)

    // Créer le dossier si manquant
    ensureDirectory(dir)

    // Créer le fichier si manquant
    ensureFile(fullPath)
  })

  console.log('\n🏁 Auto-Fix terminé.')
  console.log('Tous les dossiers et fichiers manquants ont été créés.')
}

autoFixArchitecture()
