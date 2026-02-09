import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// in main.jsx or App.jsx
import "leaflet/dist/leaflet.css";

import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
