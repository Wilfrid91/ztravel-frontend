import React, { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from '../../utils/axios'
import styles from './VerifyEmail.module.css'

const VerifyEmail = () => {
  const location = useLocation()
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const params = new URLSearchParams(location.search)
  const token = params.get('token')
  const email = params.get('email')

  const verify = useCallback(async () => {
    setLoading(true)
    try {
      await axios.post('/api/v1/auth/verify-email', {
        verificationToken: token,
        email: email,
      })
    } catch (err) {
      console.error('Erreur de vérification:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [token, email])

  useEffect(() => {
    verify()
  }, [verify])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.title}>Bienvenue sur ZTravel consulting</h2>
        </div>
        <div className={styles.right}>
          <div className={styles.loader} />
          <h2>Vérification en cours...</h2>
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
          <h4>
            Une erreur s'est produite, veuillez vérifier votre lien de
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
          <h2>Compte confirmé !</h2>
          <Link to='/login' className='btn'>
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
