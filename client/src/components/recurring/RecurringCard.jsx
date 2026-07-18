import { motion } from 'framer-motion'
import { Trash2, Pause, Play, ArrowUpRight, ArrowDownRight, CalendarClock } from 'lucide-react'
import { iconComponents, getCategoryIcon } from '../../utils/categoryIcons'

const frequencyLabel = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
}

const RecurringCard = ({ transaction, onToggle, onDelete, categories = [] }) => {
  const { title, amount, type, category, paymentMethod, frequency, nextDueDate, isActive, notes } = transaction

  const getIcon = () => {
    const defaultIcon = getCategoryIcon(category)
    if (defaultIcon && defaultIcon.icon !== iconComponents.Package) return defaultIcon
    const custom = categories.find((c) => c.name === category)
    if (custom) {
      return {
        icon: iconComponents[custom.icon] || iconComponents.Package,
        color: '',
        bg: '',
        customColor: custom.color,
      }
    }
    return { icon: iconComponents.Package, color: 'text-gray-400', bg: 'bg-gray-500/10' }
  }

  const { icon: Icon, color, bg, customColor } = getIcon()

  const daysUntilDue = Math.ceil((new Date(nextDueDate) - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[var(--bg-card)] border rounded-xl p-5 transition ${
        isActive ? 'border-[var(--border)]' : 'border-[var(--border)] opacity-60'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${bg}`}
            style={customColor ? { backgroundColor: `${customColor}20` } : {}}
          >
            <Icon className={`w-5 h-5 ${color}`} style={customColor ? { color: customColor } : {}} />
          </div>
          <div className="min-w-0">
            <p className="text-[var(--text-primary)] font-medium truncate">{title}</p>
            <p className="text-[var(--text-secondary)] text-xs">{category} · {paymentMethod}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggle(transaction._id)}
            className={`p-1.5 rounded-md transition ${
              isActive
                ? 'text-[var(--text-secondary)] hover:text-yellow-400 hover:bg-yellow-500/10'
                : 'text-[var(--text-secondary)] hover:text-green-400 hover:bg-green-500/10'
            }`}
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onDelete(transaction._id)}
            className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-1 font-semibold ${type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
          {type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          ₹{amount.toLocaleString('en-IN')}
        </span>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
          {frequencyLabel[frequency]}
        </span>
      </div>

      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--border)]">
        <CalendarClock className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        <span className="text-xs text-[var(--text-secondary)]">
          Next: {new Date(nextDueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          {daysUntilDue <= 3 && daysUntilDue >= 0 && (
            <span className="ml-1.5 text-yellow-400 font-medium">
              ({daysUntilDue === 0 ? 'Today!' : `${daysUntilDue} days`})
            </span>
          )}
          {daysUntilDue < 0 && (
            <span className="ml-1.5 text-red-400 font-medium">(Overdue)</span>
          )}
        </span>
      </div>

      {notes && (
        <p className="text-[var(--text-secondary)] text-xs mt-2 truncate">{notes}</p>
      )}

      {!isActive && (
        <div className="mt-2 text-xs text-yellow-400 bg-yellow-500/10 rounded-lg px-2.5 py-1.5 text-center">
          Paused — transactions generate nahi honge
        </div>
      )}
    </motion.div>
  )
}

export default RecurringCard