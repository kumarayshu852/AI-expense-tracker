import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Loader2, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { updateProfile, changePassword } from '../services/authService'

const currencies = ['INR', 'USD', 'EUR', 'GBP']

const Settings = () => {
  const { user, updateUser } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [currency, setCurrency] = useState(user?.currency || 'INR')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')

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

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-[var(--text-primary)] text-xl font-semibold">Settings</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-0.5">Manage your profile and account.</p>
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