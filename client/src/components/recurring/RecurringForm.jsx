import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { PAYMENT_METHODS } from '../../utils/constants'
import { getCategories } from '../../services/categoryService'
import { iconComponents } from '../../utils/categoryIcons'

const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

const emptyForm = {
  title: '',
  amount: '',
  type: 'expense',
  category: '',
  paymentMethod: 'Cash',
  notes: '',
  frequency: 'monthly',
  startDate: new Date().toISOString().split('T')[0],
}

const RecurringForm = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [catLoading, setCatLoading] = useState(true)

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories()
        setCategories(res.data.data.categories)
        if (res.data.data.categories.length > 0) {
          setForm((prev) => ({ ...prev, category: res.data.data.categories[0].name }))
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      } finally {
        setCatLoading(false)
      }
    }
    if (isOpen) fetchCats()
  }, [isOpen])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({ ...form, amount: Number(form.amount) })
      setForm(emptyForm)
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
            className="relative z-10 w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Add Recurring Transaction</h2>
              <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Type toggle */}
              <div className="flex gap-2">
                {['expense', 'income'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition capitalize ${
                      form.type === t
                        ? t === 'expense'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title (e.g. Monthly Rent)"
                required
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
              />

              <input
                name="amount"
                type="number"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="Amount"
                required
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
              />

              {/* Frequency selector */}
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Frequency</label>
                <div className="grid grid-cols-4 gap-2">
                  {FREQUENCIES.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setForm({ ...form, frequency: f.value })}
                      className={`py-2 rounded-lg text-xs font-medium transition ${
                        form.frequency === f.value
                          ? 'bg-primary text-white'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-primary/50 border border-[var(--border)]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category picker */}
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Category</label>
                {catLoading ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">Loading...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                    {categories.map((cat) => {
                      const IconComp = iconComponents[cat.icon] || iconComponents.Package
                      const isSelected = form.category === cat.name
                      return (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => setForm({ ...form, category: cat.name })}
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
                          <span className="truncate">{cat.name}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
              >
                {PAYMENT_METHODS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>

              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">Start Date</label>
                <input
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
                />
              </div>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Notes (optional)"
                rows={2}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary resize-none"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !form.category}
                className="w-full bg-gradient-to-r from-primary to-accent-cyan text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Recurring'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default RecurringForm