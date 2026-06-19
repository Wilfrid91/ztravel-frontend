import reportWebVitals from './reportWebVitals'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../src/reducers/store'
import App from './App'
import { AppProvider } from './context' // to get the information from the email => Handle VerifyPage pour déboguer :

import { createRoot } from 'react-dom/client'
import './global.css'

// This is the ID of the div in your index.html file
// React.StrictMode monte ton composant deux fois en développement.
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(
  <AppProvider store={store}>
    <App />
  </AppProvider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals()
