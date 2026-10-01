import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from '../components/Header'
import RefundMTN from './RefundMtn'
import RefundFedaPay from './RefundFedaPay'
import RefundAll from './RefundAll'
import UserAccount from './UserAccount'
import UserAccounts from './UserAccounts'
import UserCGU from './UserCgu'
import AllPayments from './AllPayments'
import VisitTracker from './VisitTracker'
import styles from '../styles/BusinessApp.module.css'
import Footer from '../components/Footer'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeSidebar = () => setSidebarOpen(false)
  /* MENU:
    ------
      users
      transactions
      refund
    SOUS MENU : 
    ---------
      user-accounts
      user-account
      user-cgu
      payments
      refund-all
      refund-mtn
      refund-fedapay
    */
  const [activeNav, setActiveNav] = useState('user-accounts')

  const renderTabContent = () => {
    switch (activeNav) {
      case 'user-accounts':
        return <UserAccounts />

      case 'user-account':
        return <UserAccount />

      case 'user-cgu':
        return <UserCGU />

      case 'payments':
        return <AllPayments />

      case 'refund-all':
        return <RefundAll />

      case 'refund-mtn':
        return <RefundMTN />

      case 'refund-fedapay':
        return <RefundFedaPay />

      case 'visit-tracker':
        return <VisitTracker />

      default:
        return <UserAccounts />
    }
  }

  return (
    <div className={styles.BusinessAppLayout}>
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayActive : ''}`}
        onClick={closeSidebar}
      />
      <div className={styles.layoutWrapper}>
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          sidebarOpen={sidebarOpen}
          onClose={closeSidebar}
        />
        <main className={styles.mainContent}>{renderTabContent()}</main>
      </div>

      <Footer />
    </div>
  )
}
