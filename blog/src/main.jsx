import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NotificationProvider } from './contexts/notificationContext'
import { UserProvider } from './contexts/userContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
    <NotificationProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </NotificationProvider>
    </UserProvider>
  </QueryClientProvider>
)
