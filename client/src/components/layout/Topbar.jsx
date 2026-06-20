import { Moon, Sun, Menu } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const Topbar = ({ title = 'Dashboard', onMenuClick }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-8 border-b border-[var(--border)] bg-[var(--bg-primary)]/70 backdrop-blur sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-3">
        {/* Hamburger — sirf mobile/tablet pe dikhega */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-lg bg-[var(--border)]/40 hover:bg-[var(--border)]/70 flex items-center justify-center transition"
        >
          <Menu className="w-4 h-4 text-[var(--text-primary)]" />
        </button>
        <h1 className="text-[var(--text-primary)] text-lg font-semibold">{title}</h1>
      </div>

      <button
        onClick={toggleTheme}
        className="w-9 h-9 rounded-lg bg-[var(--border)]/40 hover:bg-[var(--border)]/70 flex items-center justify-center transition"
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-yellow-400" />
        ) : (
          <Moon className="w-4 h-4 text-[var(--text-secondary)]" />
        )}
      </button>
    </header>
  )
}

export default Topbar