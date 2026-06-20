import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { CATEGORIES } from '../../utils/constants'

const now = new Date()

const BudgetForm = ({ isOpen, onClose, onSubmit, existingCategories = [] }) => {
  const [category, setCategory] = useState(CATEGORIES[0])
  const [monthlyLimit, setMonthlyLimit] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        category,
        monthlyLimit: Number(monthlyLimit),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      })
      setMonthlyLimit('')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative z-10 w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Set Budget</h2>
              <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm text-[var(--text-secondary)] mb-1 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {existingCategories.includes(category) && (
                  <p className="text-xs text-yellow-400 mt-1">A budget for this category is already set. Submitting will update it.</p>
                )}
              </div>

              <div>
                <label className="text-sm text-[var(--text-secondary)] mb-1 block">Monthly Limit (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value)}
                  required
                  placeholder="e.g. 5000"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent-cyan text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Budget'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default BudgetForm