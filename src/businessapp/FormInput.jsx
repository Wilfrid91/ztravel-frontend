import React from 'react'
import styles from '../styles/FormInput.module.css'

const FormInput = ({
  label,
  type,
  name,
  value,
  onChange,
  maxLength,
  required,
}) => {
  return (
    <div className={styles.row}>
      <label htmlFor={name} className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={styles.input}
        required={required}
      />
    </div>
  )
}

export default FormInput
