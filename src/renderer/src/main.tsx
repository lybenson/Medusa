import ReactDOM from 'react-dom/client'
import './global.css'
import App from './App'
import { ThemeProvider } from './themeProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
)
