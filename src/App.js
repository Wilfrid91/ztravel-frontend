import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//import TravelMenu from './components/TravelMenu'
import Login from './pages/Login'
import BusinessApp from './pages/BusinessApp'
import ImageUploader from './pages/ImageUploader'
import Register from './pages/Register'
import VerifyPage from './pages/VerifyPage'
import HomePage from './pages/HomePage'
import MomoWebhook from './pages/MomoWebhook'
import Simulator from './components/Main/AVDSimulatorMain'
import FedaPayPaymentProcessing from './pages/FedaPayPaymentProcessing'
import FedaPayPaymentError from './pages/FedaPayPaymentError'
import SessionExpiree from './pages/SessionExpiree'
import AdminLayout from './adm/AdminLayout'
import UserAccountsTable from './adm/UserAccountsTable'
import UserAccountPage from './adm/UserAccountPage'
import UserPaymentData from './adm/UserPaymentData'
import RefundMtnForm from './adm/RefundMtnForm'
import RefundFedapayForm from './adm/RefundFedapayForm'
import RefundAllDataForm from './adm/RefundAllDataForm'

import axios from 'axios'
axios.defaults.withCredentials = true

axios.interceptors.response.use(
  (response) => response, // Fonction exécutée quand la requête Axios réussit.
  // Fonction exécutée quand la requête échoue.
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/session-expiree'
      return
    }
    return Promise.reject(error)
  },
)

// Within V6, you can't use the component prop anymore. It was replaced in  favor of element
const App = () => {
  return (
    <BrowserRouter>
      {/* Le container doit être rendu UNE SEULE FOIS */}
      <ToastContainer position='top-right' autoClose={3000} />
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/verify-email' element={<VerifyPage />}></Route>
        <Route path='/businessapp' element={<BusinessApp />}></Route>
        <Route path='/dashboard' element={<ImageUploader />}></Route>
        <Route path='/mtn-callback' element={<MomoWebhook />}></Route>
        <Route path='/avd-simulator' element={<Simulator />}></Route>
        <Route path='/payment-error' element={<FedaPayPaymentError />} />
        <Route
          path='/payment-processing'
          element={<FedaPayPaymentProcessing />}
        />
        <Route path='/session-expiree' element={<SessionExpiree />} />
        <Route path='/admin' element={<AdminLayout />}>
          <Route path='user-accounts' element={<UserAccountsTable />} />
          <Route path='user-account' element={<UserAccountPage />} />
          <Route path='user-data' element={<UserPaymentData />} />
          <Route path='refund-mtn' element={<RefundMtnForm />} />
          <Route path='refund-fedapay' element={<RefundFedapayForm />} />
          <Route path='refund-all' element={<RefundAllDataForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
