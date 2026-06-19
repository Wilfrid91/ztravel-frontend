import { useState } from 'react'
import { MENU_ITEMS } from '../data/HomePage.js'
import Header from '../components/Header/Header.jsx'
import HomeMain from '../components/Main/HomeMain.jsx'

/* Handle the main page: http://localhost:3000/*/
const HomePage = () => {
  const [activeNav, setActiveNav] = useState(MENU_ITEMS[0].id)

  return (
    <div className='app-container'>
      <HomeMain activeNav={activeNav} setActiveNav={setActiveNav} />
    </div>
  )
}

export default HomePage
