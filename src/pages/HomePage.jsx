import { useState } from 'react'
import HomeMain from '../home/HomeMain'
import { MENU_ITEMS } from '../data/HomePage.js'

const HomePage = () => {
  const [activeNav, setActiveNav] = useState(MENU_ITEMS[0].id)

  return (
    <div className='app-container'>
      <HomeMain activeNav={activeNav} setActiveNav={setActiveNav} />
    </div>
  )
}

export default HomePage
