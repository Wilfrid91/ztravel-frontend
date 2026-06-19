import React from 'react'
import styles from '../css/Login.module.css'

const FormRow = ({ label, type, name, value, handleChange, maxLength }) => {
  return (
    <div className={styles.formRow}>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        className={styles.formInput}
        maxLength={maxLength}
      />
    </div>
  )
}

export default FormRow
