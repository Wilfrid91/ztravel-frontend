// Fichier généré automatiquement
import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from '../utils/axiosInstance'
import styles from '../styles/BusinessApp.module.css'

// Icons (react-icons version)
import { FiUser, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi'

const UserIcon = () => <FiUser className={styles.icon} />
const PhoneIcon = () => <FiPhone className={styles.icon} />
const MessageIcon = () => <FiMessageSquare className={styles.icon} />
const EmailIcon = () => <FiMail className={styles.icon} />

export default function ContactForm() {
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
      if (file.size > 2 * 1024 * 1024) {
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
      const response = await axios.post(
        '/api/v1/business/post-form',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      toast.success(response.data.msg || 'Message envoyé avec succès !')
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
      toast.error(
        err.response?.data?.msg ||
          'Erreur lors de la soumission du formulaire.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType='multipart/form-data'
      className={styles.form}
    >
      <div className={styles.intro}>
        <span className={styles.introStrong}>Parlons de votre projet.</span>
        <p>
          Que vous cherchiez un véhicule, un équipement ou un conseil
          personnalisé, nous vous accompagnons étape par étape. Laissez-nous un
          message avec vos besoins, et nous reviendrons vers vous dans les plus
          brefs délais.
        </p>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor='name'>
          <UserIcon /> Nom <span className={styles.required}>*</span>
        </label>
        <input
          id='name'
          name='name'
          type='text'
          className={styles.input}
          placeholder='Votre nom'
          required
          maxLength='50'
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor='email'>
          <EmailIcon /> E-mail <span className={styles.required}>*</span>
        </label>
        <input
          id='email'
          name='email'
          type='email'
          className={styles.input}
          placeholder='Votre email'
          required
          maxLength='25'
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor='phone'>
          <PhoneIcon /> Téléphone <span className={styles.required}>*</span>
        </label>
        <input
          id='phone'
          name='phone'
          type='text'
          className={styles.input}
          placeholder='Votre numéro'
          required
          maxLength='15'
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor='message'>
          <MessageIcon /> Message <span className={styles.required}>*</span>
        </label>
        <textarea
          id='message'
          name='message'
          className={styles.textarea}
          placeholder='Votre message...'
          required
          maxLength='500'
          value={form.message}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor='productPhoto'>Photo du produit</label>
        <input
          id='productPhoto'
          name='productPhoto'
          type='file'
          ref={fileInputRef}
          accept='image/*'
          className={styles.fileInput}
          onChange={handleFileChange}
        />
      </div>

      <div className={`${styles.formGroup} ${styles.captchaGroup}`}>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey='6LetusQsAAAAAF9LlMl-JzFIHKRk39LUpR6b5IfN'
          onChange={(token) =>
            setForm((prev) => ({ ...prev, captchaToken: token }))
          }
        />
      </div>

      <button type='submit' className={styles.submit} disabled={loading}>
        {loading ? 'Envoi en cours...' : 'Envoyer le message'}
      </button>
    </form>
  )
}
