import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomeMain from './home/HomeMain'
import Login from './auth/Login'
import Register from './auth/Register'

import BusinessApp from './businessapp/BusinessApp'

// ADMIN
import AdminLayout from './admin/AdminLayout'
import RefundMtn from './admin/RefundMtn'
import RefundFedaPay from './admin/RefundFedaPay'
import RefundAll from './admin/RefundAll'
import UserAccount from './admin/UserAccount'
import HomePage from './pages/HomePage'
import PaymentProcessing from './pages/PaymentProcessing'
import PaymentError from './pages/PaymentProcessing'
import AvdSimulator from './businessapp/AVDSimulator' // ou SimulatorPage.jsx

// CALLBACK MTN
import MtnCallback from './businessapp/components/MtnCallback'

// SESSION EXPIRÉE
import SessionExpiree from './auth/SessionExpiree'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HOME */}
        <Route path='/' element={<HomePage />} />
        {/* AUTH */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        {/* BUSINESS APP */}
        <Route path='/businessapp' element={<BusinessApp />} />

        {/* BUSINESS APP */}
        <Route path='/payment-processing' element={<PaymentProcessing />} />

        <Route path='/payment-error' element={<PaymentError />} />
        {/* SIMULATEUR */}
        <Route path='/avd-simulator' element={<AvdSimulator />} />
        {/* CALLBACK MTN */}
        <Route path='/mtn/callback' element={<MtnCallback />} />
        {/* SESSION */}
        <Route path='/session-expiree' element={<SessionExpiree />} />
        {/* ADMIN */}
        <Route path='/admin' element={<AdminLayout />} />
        <Route path='/admin/refund-mtn' element={<RefundMtn />} />
        <Route path='/admin/refund-fedapay' element={<RefundFedaPay />} />
        <Route path='/admin/refund-all' element={<RefundAll />} />
        <Route path='/admin/user-account' element={<UserAccount />} />
      </Routes>
    </BrowserRouter>
  )
}
