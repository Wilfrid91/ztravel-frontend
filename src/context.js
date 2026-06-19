import axios from 'axios'
import React, { useContext, useState, useEffect } from 'react'
const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const saveUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const removeUser = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const logoutUser = async () => {
    try {
      await axios.delete('/api/v1/auth/logout', { withCredentials: true })
      removeUser()
      //navigate('/login') //=> Navigate can't be used here
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // fetchUser()  // tu peux l'activer si tu veux auto-login via refreshToken
    setIsLoading(false)
  }, [])

  return (
    <AppContext.Provider
      value={{
        isLoading,
        saveUser,
        user,
        logoutUser,
        removeUser,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useGlobalContext = () => useContext(AppContext)

export { AppProvider }
