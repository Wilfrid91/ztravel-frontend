import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from '../utils/axiosInstance'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const saveUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logoutUser = async () => {
    try {
      await axios.delete('/api/v1/auth/logout', { withCredentials: true })
    } catch (err) {
      console.log(err)
    }
    setUser(null)
    localStorage.removeItem('user')
  }

  const removeUser = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{ isLoading, saveUser, user, logoutUser, removeUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
