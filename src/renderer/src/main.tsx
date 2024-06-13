import ReactDOM from 'react-dom/client'
import './global.css'
import App from './App'
import { ThemeProvider } from './themeProvider'
import { Toaster } from './components/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider>
    <QueryClientProvider client={new QueryClient()}>
      <App />
    </QueryClientProvider>
    <Toaster />
  </ThemeProvider>
)
