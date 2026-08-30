import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { SiteProvider } from './context/SiteContext'
import './index.css'

// Mark JS as loaded - CSS uses this to gate fade-up animations
// Prevents iOS blink where elements start at opacity:0 and flash visible
document.documentElement.classList.add('js-loaded')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <SiteProvider>
          <App />
        </SiteProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
