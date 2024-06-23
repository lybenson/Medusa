import ReactDOM from 'react-dom/client'
import './global.css'
import App from './App'
// import { ThemeProvider } from './themeProvider'
import { Toaster } from './components/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <div>
    <QueryClientProvider client={new QueryClient()}>
      <HashRouter>
        <App />
      </HashRouter>
    </QueryClientProvider>
    <Toaster />
  </div>
)
