import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ServerStatusProvider } from './context/ServerStatusContext'
import ServerStatusBanner from './components/shared/ServerStatusBanner'
import ProtectedRoute from './components/shared/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Budgets from './pages/Budgets'
import Analytics from './pages/Analytics'
import AIAssistant from './pages/AIAssistant'
import Settings from './pages/Settings'
import Recurring from './pages/Recurring'
import Goals from './pages/Goals'
import DashboardLayout from './components/layout/DashboardLayout'
import BudgetAlerts from './components/shared/BudegetAlerts'

function App() {
  return (
    <ServerStatusProvider>
      <ThemeProvider>
        <AuthProvider>
          <ServerStatusBanner />
          <BudgetAlerts />
          <Router>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path='/dashboard' element={<Dashboard />} />
                  <Route path='/expenses' element={<Expenses />} />
                  <Route path='/recurring' element={<Recurring />} />
                  <Route path='/budgets' element={<Budgets />} />
                  <Route path='/analytics' element={<Analytics />} />
                  <Route path='/ai-assistant' element={<AIAssistant />} />
                  <Route path='/goals' element={<Goals />} />
                  <Route path='/settings' element={<Settings />} />
                </Route>
              </Route>

              <Route path='/' element={<Navigate to='/dashboard' replace />} />
              <Route path='*' element={<Navigate to='/dashboard' replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ServerStatusProvider>
  )
}

export default App