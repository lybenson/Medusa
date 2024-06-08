import ReactDOM from 'react-dom/client'
import './global.css'
import App from './App'
import { ThemeProvider } from './themeProvider'
import { Toaster } from './components/ui/sonner'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider>
    <App />
    <Toaster />
  </ThemeProvider>
)
