import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Loader2, Check, Plus, Trash2, Tag, Palette } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme, ACCENT_COLORS } from '../context/ThemeContext'
import { updateProfile, changePassword } from '../services/authService'
import { getCategories, createCategory, deleteCategory } from '../services/categoryService'
import { iconComponents, availableIcons } from '../utils/categoryIcons'

const COLORS = [
  '#8B5CF6', '#3B82F6', '#06B6D4', '#10B981', '#F59E0B',
  '#EF4444', '#EC4899', '#F97316', '#84CC16', '#6B7280',
]

const currencies = ['INR', 'USD', 'EUR', 'GBP']

const Settings = () => {
  const { user, updateUser } = useAuth()
  const { theme, toggleTheme, accent, setAccent, uiStyle, setUiStyle } = useTheme()

  // Profile
  const [name, setName] = useState(user?.name || '')
  const [currency, setCurrency] = useState(user?.currency || 'INR')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  // Categories
  const [categories, setCategories] = useState([])
  const [catLoading, setCatLoading] = useState(true)
  const [newCatName, setNewCatName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('Package')
  const [newCatColor, setNewCatColor] = useState('#8B5CF6')
  const [catAdding, setCatAdding] = useState(false)
  const [catError, setCatError] = useState('')

  const fetchCategories = async () => {
    try {
      const res = await getCategories()
      setCategories(res.data.data.categories)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    } finally {
      setCatLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileSuccess(false)
    try {
      const res = await updateProfile({ name, currency })
      updateUser(res.data.data.user)
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 2500)
    } catch (err) {
      console.error('Profile update failed:', err)
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordLoading(true)
    setPasswordSuccess(false)
    try {
      await changePassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setPasswordSuccess(true)
      setTimeout(() => setPasswordSuccess(false), 2500)
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Password change failed')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    setCatError('')
    if (!newCatName.trim()) return
    setCatAdding(true)
    try {
      await createCategory({ name: newCatName.trim(), icon: newCatIcon, color: newCatColor })
      setNewCatName('')
      setNewCatIcon('Package')
      setNewCatColor('#8B5CF6')
      fetchCategories()
    } catch (err) {
      setCatError(err.response?.data?.message || 'Category add karne mein error')
    } finally {
      setCatAdding(false)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Yeh custom category delete karna hai?')) return
    try {
      await deleteCategory(id)
      fetchCategories()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-[var(--text-primary)] text-xl font-semibold">Settings</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-0.5">Manage your profile and account.</p>
      </div>


      {/* UI Style picker */}
      <div>
        <p className="text-[var(--text-primary)] text-sm mb-2">UI Style</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'simple', label: 'Simple', desc: 'Clean & Flat' },
            { value: 'glass', label: 'Glass', desc: 'Glassmorphism' },
            { value: 'premium', label: 'Premium', desc: 'Dark Gradient' },
          ].map((style) => (
            <button
              key={style.value}
              onClick={() => setUiStyle(style.value)}
              className={`p-3 rounded-lg border text-left transition ${uiStyle === style.value
                  ? 'border-primary bg-primary/10'
                  : 'border-[var(--border)] bg-[var(--bg-secondary)] hover:border-primary/50'
                }`}
            >
              <p className={`text-xs font-medium ${uiStyle === style.value ? 'text-primary' : 'text-[var(--text-primary)]'}`}>
                {style.label}
              </p>
              <p className="text-[var(--text-secondary)] text-xs mt-0.5">{style.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-primary" />
          <h3 className="text-[var(--text-primary)] font-semibold text-sm">Profile Information</h3>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-secondary)] opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Preferred Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
            >
              {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={profileLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent-cyan text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-60"
          >
            {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : profileSuccess ? <Check className="w-4 h-4" /> : null}
            {profileSuccess ? 'Saved!' : 'Save Changes'}
          </motion.button>
        </form>
      </div>

      {/* Accent Color Section */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Palette className="w-4 h-4 text-primary" />
          <h3 className="text-[var(--text-primary)] font-semibold text-sm">Theme & Accent Color</h3>
        </div>

        <div className="space-y-4">
          {/* Dark/Light toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--text-primary)] text-sm">App Theme</p>
              <p className="text-[var(--text-secondary)] text-xs">Choose Dark or Light mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-[var(--border)]'
                }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                }`} />
            </button>
          </div>

          {/* Accent color picker */}
          <div>
            <p className="text-[var(--text-primary)] text-sm mb-2">Accent Color</p>
            <div className="grid grid-cols-6 gap-2">
              {Object.entries(ACCENT_COLORS).map(([name, colors]) => (
                <button
                  key={name}
                  onClick={() => setAccent(name)}
                  className={`relative h-10 rounded-lg transition border-2 ${accent === name ? 'border-white scale-105' : 'border-transparent'
                    }`}
                  style={{ backgroundColor: colors.primary }}
                  title={name}
                >
                  {accent === name && (
                    <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-[var(--text-secondary)] text-xs mt-2 capitalize">
              Current: {accent}
            </p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Tag className="w-4 h-4 text-primary" />
          <h3 className="text-[var(--text-primary)] font-semibold text-sm">Manage Categories</h3>
        </div>

        <form onSubmit={handleAddCategory} className="mb-5 space-y-3">
          {catError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg px-3 py-2">
              {catError}
            </div>
          )}

          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Category naam (e.g. Petrol, Rent)"
            maxLength={30}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
          />

          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-2">Icon choose karo:</p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {availableIcons.map((iconName) => {
                const IconComp = iconComponents[iconName]
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setNewCatIcon(iconName)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${newCatIcon === iconName
                        ? 'bg-primary text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border)]/50'
                      }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-2">Choose a color</p>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewCatColor(color)}
                  className={`w-7 h-7 rounded-full transition border-2 ${newCatColor === color ? 'border-white scale-110' : 'border-transparent'
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {newCatName.trim() && (
            <div className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-lg px-3 py-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${newCatColor}20` }}>
                {(() => {
                  const IconComp = iconComponents[newCatIcon] || iconComponents.Package
                  return <IconComp className="w-4 h-4" style={{ color: newCatColor }} />
                })()}
              </div>
              <span className="text-[var(--text-primary)] text-sm">{newCatName}</span>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={catAdding || !newCatName.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent-cyan text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-60"
          >
            {catAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Category
          </motion.button>
        </form>

        {catLoading ? (
          <div className="flex items-center justify-center h-20">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-[var(--text-secondary)] mb-2">
              Default categories (cannot be deleted) + your custom categories:
            </p>
            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
              {categories.map((cat) => {
                const IconComp = iconComponents[cat.icon] || iconComponents.Package
                return (
                  <div
                    key={cat._id || cat.name}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--bg-secondary)]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                        <IconComp className="w-3.5 h-3.5" style={{ color: cat.color }} />
                      </div>
                      <span className="text-[var(--text-primary)] text-sm">{cat.name}</span>
                    </div>

                    {cat.isDefault ? (
                      <span className="text-[var(--text-secondary)] text-xs">Default</span>
                    ) : (
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock className="w-4 h-4 text-primary" />
          <h3 className="text-[var(--text-primary)] font-semibold text-sm">Change Password</h3>
        </div>

        {passwordError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
            {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm text-[var(--text-secondary)] mb-1 block">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={passwordLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent-cyan text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-60"
          >
            {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : passwordSuccess ? <Check className="w-4 h-4" /> : null}
            {passwordSuccess ? 'Updated!' : 'Update Password'}
          </motion.button>
        </form>
      </div>
    </div>
  )
}

export default Settings