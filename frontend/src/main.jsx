import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {ApiProvider} from './context/ApiContext.jsx'
import './index.css'
import './assets/styles/global.css';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApiProvider>
    <App />
    </ApiProvider>
  </StrictMode>,
)
