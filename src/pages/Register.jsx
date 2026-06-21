import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import useLocalState from '../utils/localState'
import FormRow from './FormRow'
import styles from '../css/Register.module.css'
import { toast } from 'react-toastify'

const Register = () => {
  //const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    repassword: '',
  })

  const { alert, loading, setLoading, setSuccess, hideAlert } = useLocalState()

  const handleChange = (e) => {
    const { name, value } = e.target
    // (prev) => { ... }: fonction de mise à jour d’état, représente l’ancienne valeur du state juste avant la mise à jour
    // return implicite des fonctions fléchées :
    // Les parenthèses (...) disent à JS : ceci est un objet, pas un bloc de code, donc pas besoin de return
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    hideAlert()
    setLoading(true)
    try {
      const { data } = await axios.post(`/api/v1/auth/register`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setSuccess(true)
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        repassword: '',
      })

      toast.success(data.msg)
    } catch (error) {
      const { msg } = error.response.data
      toast.error(msg || 'Il y  une erreur')
    }

    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h2 className={styles.title}>Bienvenue sur Zinsou travel consulting</h2>
      </div>

      <div className={styles.right}>
        <div className={styles.form}>
          {alert.show && (
            <div className={`alert alert-${alert.type}`}>{alert.text}</div>
          )}
          <form
            className={
              loading ? `${styles.form} ${styles.formLoading}` : styles.form
            }
            onSubmit={onSubmit}
          >
            <div className={styles.formRow}>
              <FormRow
                type='text'
                name='nom'
                label='Nom'
                value={formData.nom}
                handleChange={handleChange}
                maxLength={15}
              />
            </div>
            <div className={styles.formRow}>
              <FormRow
                type='text'
                name='prenom'
                label='Prénom'
                value={formData.prenom}
                handleChange={handleChange}
                maxLength={15}
              />
            </div>
            <div className={styles.formRow}>
              <FormRow
                type='email'
                name='email'
                label='Email'
                value={formData.email}
                handleChange={handleChange}
                maxLength={25}
              />
            </div>
            <div className={styles.formRow}>
              <FormRow
                type='password'
                name='password'
                label='Mot de passe'
                value={formData.password}
                handleChange={handleChange}
                maxLength={20}
              />
            </div>
            <div className={styles.formRow}>
              <FormRow
                type='password'
                name='repassword'
                label='Confirmer mot de passe'
                value={formData.repassword}
                handleChange={handleChange}
                maxLength={20}
              />
            </div>
            <button
              type='submit'
              className={styles.btnBlock}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Register'}
            </button>
            <p className={styles.textLine}>
              Vous avez déjà un compte ?{' '}
              <Link to='/login' className={styles.loginLink}>
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
