import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Receipt, PiggyBank, BarChart3,
  Sparkles, Settings as SettingsIcon, LogOut, X, RefreshCw, Target,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/expenses', icon: Receipt, label: 'Expenses' },
  { to: '/recurring', icon: RefreshCw, label: 'Recurring' },
  { to: '/budgets', icon: PiggyBank, label: 'Budgets' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/ai-assistant', icon: Sparkles, label: 'AI Assistant' },
  { to: '/settings', icon: SettingsIcon, label: 'Settings' },
]

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="text-[var(--text-primary)] font-semibold text-lg">Expense Tracker</span>
        </div>
        <button onClick={onClose} className="lg:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition relative ${
                isActive
                  ? 'text-[var(--text-primary)] bg-[var(--border)]/50'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]/30'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
                  />
                )}
                <Icon className="w-4 h-4" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center text-white text-sm font-medium">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-[var(--text-primary)] text-sm truncate">{user?.name}</p>
            <p className="text-[var(--text-secondary)] text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition w-full"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <>
      <aside className="hidden lg:flex w-64 h-screen bg-[var(--bg-secondary)] border-r border-[var(--border)] flex-col fixed left-0 top-0 transition-colors">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="lg:hidden flex w-64 h-screen bg-[var(--bg-secondary)] border-r border-[var(--border)] flex-col fixed left-0 top-0 z-50"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar