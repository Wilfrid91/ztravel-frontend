import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormRow from './FormRow'
import { useState } from 'react'
import { useGlobalContext } from '../context'

import styles from '../css/Login.module.css'

import axios from 'axios'
import useLocalState from '../utils/localState'
import { toast } from 'react-toastify'

const Login = () => {
  const { saveUser } = useGlobalContext()
  const [values, setValues] = useState({
    email: '',
    password: '',
  })

  const { alert, loading, setLoading } = useLocalState()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    const { email, password } = values
    const loginUser = { email, password }

    try {
      // Axios renvoie directement un objet response.
      //const res = await axios.post(`/api/v1/auth/login`, loginUser)
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/auth/login`,
        loginUser,
      )

      const data = res.data
      // Login OK
      toast.success(
        `Bienvenue, ${data.user.prenom}. Redirection vers Chine : Achetez malin, rentrez serein.`,
      )

      saveUser(data.user)
      setValues({ name: '', email: '', password: '' })
      setLoading(false)

      if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/businessapp')
      }
    } catch (error) {
      /**
       * Quand Axios reçoit une erreur HTTP (400, 401, 429…), il renvoie un objet comme 
       * error = {
          response: {
          status: 400,
          data: {
            msg: "Identifiants invalides"
              }
            }
          }
       */
      setLoading(false)

      // Rate limit atteint
      // Afficher message à l'utilisateur
      // Rate limit
      if (error.response?.status === 429) {
        toast.error(
          error.response.data.message ||
            'Trop de tentatives, veuillez réessayer dans 15 minutes',
        )
        return
      }
      if (error.response?.status === 401) {
        toast.error(
          error.response.data.message ||
            "Le mot de passe saisi ou l'email est incorrect",
        )
        return
      }
      // Autres erreurs
      // ?.=> Si la partie avant ?. existe, alors accède à la suite.
      toast.error(error.response?.data?.msg || 'Erreur de connexion')
    }
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.title}>Bienvenue sur ZTravel consulting</h2>
        </div>
        <div className={styles.right}>
          <div className={styles.form}>
            {alert.show && (
              <div className={`alert alert-${alert.type}`}>{alert.text}</div>
            )}
            <form
              className={loading ? 'form form-loading' : 'form'}
              onSubmit={onSubmit}
            >
              {/* single form row */}
              <div className={styles.formRow}>
                <FormRow
                  label='Email'
                  type='email'
                  name='email'
                  value={values.email}
                  handleChange={handleChange}
                  maxLength={35}
                />
              </div>
              {/* end of single form row */}
              {/* single form row */}
              <div className={styles.formRow}>
                <FormRow
                  label='Mot de passe'
                  type='password'
                  name='password'
                  value={values.password}
                  handleChange={handleChange}
                  maxLength={20}
                />
              </div>
              {/* end of single form row */}
              <button
                type='submit'
                className={styles.btnBlock}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
              <p className={styles.textLine}>
                Pas encore de compte ?{' '}
                <Link to='/register' className={styles.loginLink}>
                  Inscrivez-vous
                </Link>
              </p>

              <p className={styles.textLine}>
                Vous avez oublié votre mot de passe ?{' '}
                <Link to='/forgot-password' className='reset-link'>
                  Réinitialisez-le
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
