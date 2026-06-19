import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useGlobalContext } from '../context'
import axios from 'axios'
import styles from '../css/verifyPage.module.css'

function useQuery() {
  // useLocation().search) → "?token=abc123&email=test@gmail.com"
  return new URLSearchParams(useLocation().search)
}

const VerifyPage = () => {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const query = useQuery()

  const verifyToken = async () => {
    setLoading(true)
    try {
      await axios.post('/api/v1/auth/verify-email', {
        verificationToken: query.get('token'),
        email: query.get('email'),
      })
    } catch (error) {
      setError(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    verifyToken()
  }, [])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.title}>Bienvenue sur ZTravel consulting</h2>
        </div>
        <div className={styles.right}>
          <div className={styles.loader}></div>
          <h2 className={styles.title}>Vérification en cours...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.title}>Bienvenue sur ZTravel consulting</h2>
        </div>
        <div className={styles.right}>
          <h4 className={styles.title}>
            Une erreur s’est produite, veuillez vérifier votre lien de
            vérification.
          </h4>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h2 className={styles.title}>Bienvenue sur ZTravel consulting</h2>
      </div>
      <div className={styles.right}>
        <div className={styles.textLine}>
          <div className='page'>
            <h2>Compte confirmé</h2>
            <Link to='/login' className='btn'>
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyPage
