import { useEffect, useState, useRef } from 'react'

import BusinessAppMain from '../components/Main/BusinessAppMain.jsx'
import { MENU_ITEMS_DDAY } from '../data/BusinessAppPage.js'

const BusinessApp = () => {
  const [activeNav, setActiveNav] = useState(MENU_ITEMS_DDAY[0].id)

  return (
    <div className='app-container'>
      <BusinessAppMain activeNav={activeNav} setActiveNav={setActiveNav} />
    </div>
  )
}

export default BusinessApp
