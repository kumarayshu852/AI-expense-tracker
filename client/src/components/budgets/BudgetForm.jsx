import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { getCategories } from '../../services/categoryService'
import { iconComponents } from '../../utils/categoryIcons'

const now = new Date()

const BudgetForm = ({ isOpen, onClose, onSubmit, existingCategories = [] }) => {
  const [categories, setCategories] = useState([])
  const [catLoading, setCatLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [monthlyLimit, setMonthlyLimit] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories()
        setCategories(res.data.data.categories)
        if (res.data.data.categories.length > 0) {
          setSelectedCategory(res.data.data.categories[0].name)
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      } finally {
        setCatLoading(false)
      }
    }
    if (isOpen) fetchCats()
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        category: selectedCategory,
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
            className="relative z-10 w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Set Budget</h2>
              <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category picker */}
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-2 block">Choose a category.</label>
                {catLoading ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">Loading...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                    {categories.map((cat) => {
                      const IconComp = iconComponents[cat.icon] || iconComponents.Package
                      const isSelected = selectedCategory === cat.name
                      const isExisting = existingCategories.includes(cat.name)
                      return (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => setSelectedCategory(cat.name)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition text-left ${
                            isSelected
                              ? 'border border-primary bg-primary/10 text-[var(--text-primary)]'
                              : 'border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-primary/50'
                          }`}
                        >
                          <div
                            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${cat.color}20` }}
                          >
                            <IconComp className="w-3.5 h-3.5" style={{ color: cat.color }} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate">{cat.name}</p>
                            {isExisting && (
                              <p className="text-yellow-400 text-xs">Already set</p>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">Monthly Limit (₹)</label>
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
                disabled={loading || !selectedCategory}
                className="w-full bg-gradient-to-r from-primary to-accent-cyan text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
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