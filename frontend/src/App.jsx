import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthProvider'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AccountsPage from './pages/AccountsPage'
import TransferPage from './pages/TransferPage'
import TransactionHistoryPage from './pages/TransactionHistoryPage'
import ProfilePage from './pages/ProfilePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // Set to 1 for faster error feedback during development
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Persistent navigation bar displayed on all pages */}
        <Navbar />
        <main>
          <Routes>
            {/* Public routes — accessible without authentication */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes — redirect to login if not authenticated */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/transfer" element={<TransferPage />} />
            <Route path="/transactions" element={<TransactionHistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '40px' }}>Page not found.</h2>} />
          </Routes>
        </main>

        {/* Footer displayed on all pages */}
        <footer style={{ padding: '40px 20px', borderTop: '1px solid var(--border)', marginTop: '60px', textAlign: 'center' }}>
          <div style={{ marginBottom: '15px' }}>
             <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
              DUB<span style={{ color: 'var(--primary)' }}>BANK</span>
            </span>
          </div>
          <p className="site-footer" style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            © {new Date().getFullYear()} DUB Bank. Developed for educational purposes. All Rights Reserved.
          </p>
        </footer>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
