import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import PaymentModal from './PaymentModal'
import axios from '../../utils/axiosInstance'
import styles from '../../styles/MobileMoney.module.css'

const CreditCard = ({ onClose, onDataReceived }) => {
  const { user } = useAuth()

  return <PaymentModal onClose={onClose}></PaymentModal>
}

export default CreditCard
