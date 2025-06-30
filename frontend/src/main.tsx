import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/theme/Index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(

   <App />
)
