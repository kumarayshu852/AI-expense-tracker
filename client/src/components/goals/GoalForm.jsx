import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { iconComponents, availableIcons } from '../../utils/categoryIcons'

const COLORS = [
  '#8B5CF6', '#3B82F6', '#06B6D4', '#10B981', '#F59E0B',
  '#EF4444', '#EC4899', '#F97316', '#84CC16', '#6B7280',
]

const GoalForm = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [icon, setIcon] = useState('Target')
  const [color, setColor] = useState('#8B5CF6')
  const [loading, setLoading] = useState(false)

  // Min date aaj se
  const minDate = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({ title, targetAmount: Number(targetAmount), deadline, icon, color })
      setTitle('')
      setTargetAmount('')
      setDeadline('')
      setIcon('Target')
      setColor('#8B5CF6')
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
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">New Saving Goal</h2>
              <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">Goal Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. New iPhone, Emergency Fund, Trip to Goa"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">Target Amount (₹)</label>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                  min="1"
                  placeholder="e.g. 50000"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  min={minDate}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
                />
              </div>

              {/* Icon picker */}
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-2 block">Choose an icon.</label>
                <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
                  {availableIcons.map((iconName) => {
                    const IconComp = iconComponents[iconName]
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setIcon(iconName)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                          icon === iconName
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

              {/* Color picker */}
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-2 block">Choose a color.</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition border-2 ${
                        color === c ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              {title && (
                <div className="flex items-center gap-3 bg-[var(--bg-secondary)] rounded-lg px-3 py-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                    {(() => {
                      const IconComp = iconComponents[icon] || iconComponents.Package
                      return <IconComp className="w-4 h-4" style={{ color }} />
                    })()}
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)] text-sm font-medium">{title}</p>
                    {targetAmount && (
                      <p className="text-[var(--text-secondary)] text-xs">Target: ₹{Number(targetAmount).toLocaleString('en-IN')}</p>
                    )}
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent-cyan text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Goal'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default GoalForm