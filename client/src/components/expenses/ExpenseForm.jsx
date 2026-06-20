import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { CATEGORIES, PAYMENT_METHODS } from '../../utils/constants'

const emptyForm = {
  title: '',
  amount: '',
  type: 'expense',
  category: 'Food & Dining',
  paymentMethod: 'Cash',
  notes: '',
  date: new Date().toISOString().split('T')[0],
}

const ExpenseForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)

  // Edit mode mein purana data form mein bhar do
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        amount: initialData.amount,
        type: initialData.type,
        category: initialData.category,
        paymentMethod: initialData.paymentMethod,
        notes: initialData.notes || '',
        date: new Date(initialData.date).toISOString().split('T')[0],
      })
    } else {
      setForm(emptyForm)
    }
  }, [initialData, isOpen])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({ ...form, amount: Number(form.amount) })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative z-10 w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {initialData ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
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
                        ? t === 'expense' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
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
                placeholder="Title (e.g. Swiggy Order)"
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

              <div className="grid grid-cols-2 gap-3">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
                >
                  {PAYMENT_METHODS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
              />

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
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent-cyan text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : initialData ? 'Update' : 'Add Transaction'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ExpenseForm