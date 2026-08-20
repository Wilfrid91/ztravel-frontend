import { useState } from 'react'
import HomeMain from '../home/HomeMain'

const HomePage = () => {
  const [activeNav, setActiveNav] = useState('TAB1')

  return (
    <div className='app-container'>
      <HomeMain activeNav={activeNav} setActiveNav={setActiveNav} />
    </div>
  )
}

export default HomePage
