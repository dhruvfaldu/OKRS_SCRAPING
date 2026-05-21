import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { TooltipProvider } from './components/ui/tooltip'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './provider/theme-provider'


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <TooltipProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <App />
      </ThemeProvider>
    </TooltipProvider>
  </Provider>
)
