import React, { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import styles from '../css/Contact.module.css'

import { FiUser, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi'

const ContactForm = () => {
  const MAX_SIZE = 2 * 1024 * 1024
  const captchaRef = useRef(null)
  const fileRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    productPhoto: null,
    captchaToken: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      productPhoto: e.target.files[0],
    }))
  }

  const handleCaptchaChange = (token) => {
    setFormData((prevState) => ({
      ...prevState,
      captchaToken: token,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.captchaToken) {
      alert('Veuillez compléter le CAPTCHA.')
      return
    }

    const data = new FormData()

    if (fileRef.current.files.length > 0) {
      const file = fileRef.current.files[0]

      if (file.size > MAX_SIZE) {
        toast.error("L'image dépasse 2 MO")
        return
      }

      data.append('productPhoto', file)
    }

    data.append('name', formData.name)
    data.append('email', formData.email)
    data.append('phone', formData.phone)
    data.append('message', formData.message)
    data.append('g-recaptcha-response', formData.captchaToken)

    try {
      const response = await axios.post('/api/v1/business/post-form', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success(response.data.msg)
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        productPhoto: null,
        captchaToken: '',
      }) // reset all the fields when success

      captchaRef.current.reset()
      fileRef.current.value = '' // reset du champ file
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("❌ Erreur :'Erreur lors de la soumission du formulaire.")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType='multipart/form-data'
      className={styles.formCompact}
    >
      <div className={styles.contactIntro}>
        <span className={styles.introStrong}>Parlons de votre projet.</span>
        <p>
          Que vous cherchiez un véhicule, un équipement ou un conseil
          personnalisé, je vous accompagne étape par étape. Laissez-moi un
          message avec vos besoins, et je reviens vers vous dans les plus brefs
          délais.
        </p>
      </div>
      {/* Nom */}
      <div className={styles.formGroup}>
        <label htmlFor='name'>
          <FiUser className={styles.icon} /> Nom{' '}
          <span className={styles.required}>*</span>
        </label>
        <input
          id='name'
          name='name'
          type='text'
          className={styles.formInput}
          placeholder='Votre nom'
          required
          maxLength='50'
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='email'>
          <FiMail className={styles.icon} /> E-mail{' '}
          <span className={styles.required}>*</span>
        </label>
        <input
          id='email'
          name='email'
          type='email'
          className={styles.formInput}
          placeholder='Votre email'
          required
          maxLength='25'
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='phone'>
          <FiPhone className={styles.icon} /> Téléphone{' '}
          <span className={styles.required}>*</span>
        </label>
        <input
          id='phone'
          name='phone'
          type='text'
          className={styles.formInput}
          placeholder='Votre numéro'
          required
          maxLength='15'
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='message'>
          <FiMessageSquare className={styles.icon} /> Message{' '}
          <span className={styles.required}>*</span>
        </label>
        <textarea
          id='message'
          name='message'
          className={styles.formTextarea}
          placeholder='Votre message...'
          required
          maxLength='500'
          value={formData.message}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='productPhoto'>Photo du produit</label>
        <input
          id='productPhoto'
          name='productPhoto'
          type='file'
          ref={fileRef}
          accept='image/*'
          className={styles.fileUploadInput}
          onChange={handleFileChange}
        />
      </div>
      <div className={`${styles.formGroup} ${styles.captchaGroup}`}>
        <ReCAPTCHA
          ref={captchaRef}
          sitekey='6LetusQsAAAAAF9LlMl-JzFIHKRk39LUpR6b5IfN'
          onChange={handleCaptchaChange}
        />
      </div>
      <button type='submit' className={styles.contactSubmit}>
        Envoyer le message
      </button>
    </form>
  )
}

export default ContactForm
