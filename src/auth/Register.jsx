import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAlert } from '../hooks/useAlert'
import FormInput from '../components/FormInput'
import axios from '../utils/axiosInstance'
import styles from '../styles/Register.module.css'

const Register = () => {
  const { alert, showAlert, loading, setLoading, setSuccess, hideAlert } =
    useAlert()
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    repassword: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    hideAlert()
    setLoading(true)

    try {
      const { data } = await axios.post('/api/v1/auth/register', form)
      setSuccess(true)
      setForm({ nom: '', prenom: '', email: '', password: '', repassword: '' })
      toast.success(data.msg || 'Inscription réussie !')
    } catch (err) {
      const msg = err.response?.data?.msg || 'Une erreur est survenue'
      toast.error(msg)
    } finally {
      setLoading(false)
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
            className={loading ? styles.formLoading : ''}
            onSubmit={handleSubmit}
          >
            <FormInput
              label='Nom'
              type='text'
              name='nom'
              value={form.nom}
              onChange={handleChange}
              maxLength={15}
              required
            />
            <FormInput
              label='Prénom'
              type='text'
              name='prenom'
              value={form.prenom}
              onChange={handleChange}
              maxLength={15}
              required
            />
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
            <FormInput
              label='Confirmer mot de passe'
              type='password'
              name='repassword'
              value={form.repassword}
              onChange={handleChange}
              maxLength={20}
              required
            />
            <button
              type='submit'
              className={styles.btnBlock}
              disabled={loading}
            >
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>
            <p className={styles.textLine}>
              Déjà un compte ?{' '}
              <Link to='/login' className={styles.link}>
                Connectez-vous
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
