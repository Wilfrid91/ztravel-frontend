// Fichier généré automatiquement
import { useRef, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from '../utils/axiosInstance.js'
import styles from '../styles/ContactForm.module.css'
import { useAuth } from '../context/AuthContext.jsx'
import Header from './Header.jsx'

// Icons (react-icons version)
import { FiUser, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi'

const UserIcon = () => <FiUser className={styles.icon} />
const PhoneIcon = () => <FiPhone className={styles.icon} />
const MessageIcon = () => <FiMessageSquare className={styles.icon} />
const EmailIcon = () => <FiMail className={styles.icon} />

export default function FreeContactForm() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const recaptchaRef = useRef(null)
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    productPhoto: null,
    captchaToken: '',
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm((prev) => ({ ...prev, productPhoto: file }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.captchaToken) {
      toast.error('Veuillez compléter le CAPTCHA.')
      return
    }

    const formData = new FormData()

    if (fileInputRef.current?.files.length > 0) {
      const file = fileInputRef.current.files[0]
      if (file.size === 0) {
        toast.error('fichier vide,')
        return
      } else if (file.size > 2 * 1024 * 1024) {
        toast.error("L'image dépasse 2 MO")
        return
      }
      formData.append('productPhoto', file)
    }

    formData.append('name', form.name)
    formData.append('email', form.email)
    formData.append('phone', form.phone)
    formData.append('message', form.message)
    formData.append('g-recaptcha-response', form.captchaToken)

    setLoading(true)

    try {
      const response = await axios.post('/api/v1/freemium/unreg-form', formData)
      console.log('/api/v1/business/unreg-form', response.data)

      toast.success(response.data.message || 'Message envoyé avec succès !')
      setForm({
        name: '',
        email: '',
        phone: '',
        message: '',
        productPhoto: null,
        captchaToken: '',
      })
      if (recaptchaRef.current) recaptchaRef.current.reset()
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      console.error('Erreur:', err)
      toast.info(
        err.response?.data?.message ||
          'Erreur lors de la soumission du formulaire.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    setForm((prev) => ({
      ...prev,
      name: prev.name || user.nom || '',
      email: prev.email || user.email || '',
      phone: prev.phone || user.telephone || '',
    }))
  }, [user])

  return (
    <div className={styles.homeLayout}>
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className={styles.mainContent}>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <fieldset className={styles.fieldset}>
            <div className={styles.intro}>
              <span className={styles.introStrong}>
                Parlons de votre projet.
              </span>
              <p>
                Que vous cherchiez un véhicule, un équipement ou un conseil
                personnalisé, nous vous accompagnons étape par étape.
                Laissez-nous un message avec vos besoins, et nous reviendrons
                vers vous dans les plus brefs délais.
              </p>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='name'>
                <UserIcon aria-hidden='true' /> Nom{' '}
                <span className={styles.required}>*</span>
              </label>
              <input
                id='name'
                name='name'
                type='text'
                className={styles.input}
                placeholder='Votre nom'
                required
                maxLength={50}
                value={form.name}
                onChange={handleChange}
                autoComplete='name'
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='email'>
                <EmailIcon aria-hidden='true' /> E-mail{' '}
                <span className={styles.required}>*</span>
              </label>
              <input
                id='email'
                name='email'
                type='email'
                className={styles.input}
                placeholder='Votre email'
                required
                maxLength={254}
                value={form.email}
                onChange={handleChange}
                autoComplete='email'
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='phone'>
                <PhoneIcon aria-hidden='true' /> Téléphone{' '}
                <span className={styles.required}>*</span>
              </label>
              <input
                id='phone'
                name='phone'
                type='tel'
                className={styles.input}
                placeholder='Votre numéro'
                required
                maxLength={20}
                value={form.phone}
                onChange={handleChange}
                autoComplete='tel'
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='message'>
                <MessageIcon aria-hidden='true' /> Message{' '}
                <span className={styles.required}>*</span>
              </label>
              <textarea
                id='message'
                name='message'
                className={styles.textarea}
                placeholder='Votre message...'
                required
                maxLength={500}
                value={form.message}
                onChange={handleChange}
              />
              <span className={styles.charCount}>
                {form.message.length}/500
              </span>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='productPhoto'>Photo du produit</label>
              <input
                id='productPhoto'
                name='productPhoto'
                type='file'
                ref={fileInputRef}
                accept='image/png,image/jpeg,image/jpg'
                className={styles.fileInput}
                onChange={handleFileChange}
              />
              <span className={styles.fieldHint}>
                PNG ou JPG — 2 MB maximum
              </span>
            </div>
            <div className={`${styles.formGroup} ${styles.captchaGroup}`}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                onChange={(token) =>
                  setForm((prev) => ({ ...prev, captchaToken: token }))
                }
              />
            </div>
            <button type='submit' className={styles.submit} disabled={loading}>
              {loading ? (
                <>
                  <span className={styles.spinner} aria-hidden='true' />
                  Envoi en cours...
                </>
              ) : (
                'Envoyer le message'
              )}
            </button>
          </fieldset>
        </form>
      </main>
    </div>
  )
}
