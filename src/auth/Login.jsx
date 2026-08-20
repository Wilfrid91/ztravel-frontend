import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../hooks/useAlert'
import FormInput from '../components/FormInput'
import styles from '../styles/Login.module.css'
import axios from '../utils/axiosInstance'

const Login = () => {
  const navigate = useNavigate()
  const { saveUser } = useAuth()
  const { alert, showAlert, loading, setLoading, hideAlert } = useAlert()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    hideAlert()
    setLoading(true)

    try {
      const response = await axios.post('/api/v1/auth/login', form)
      const { user } = response.data
      toast.success(`Bienvenue, ${user.prenom} !`)
      saveUser(user)
      setForm({ email: '', password: '' })
      setLoading(false)
      navigate(user.role === 'admin' ? '/admin' : '/businessapp')
    } catch (err) {
      setLoading(false)
      const status = err.response?.status
      const msg = err.response?.data?.message || err.response?.data?.msg

      if (status === 429) {
        toast.error('Trop de tentatives, réessayez dans 15 minutes')
      } else if (status === 401) {
        toast.error('Email ou mot de passe incorrect')
      } else {
        toast.error(msg || 'Erreur de connexion')
      }
    }
  }

  return (
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
            className={loading ? 'form-loading' : ''}
            onSubmit={handleSubmit}
          >
            <FormInput
              label='Email'
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              maxLength={35}
              required
            />
            <FormInput
              label='Mot de passe'
              type='password'
              name='password'
              value={form.password}
              onChange={handleChange}
              maxLength={20}
              required
            />
            <button
              type='submit'
              className={styles.btnBlock}
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
            <p className={styles.textLine}>
              Pas encore de compte ?{' '}
              <Link to='/register' className={styles.link}>
                Inscrivez-vous
              </Link>
            </p>
            <p className={styles.textLine}>
              Mot de passe oublié ?{' '}
              <Link to='/forgot-password' className={styles.link}>
                Réinitialisez-le
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
