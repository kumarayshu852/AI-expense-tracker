import { motion } from 'framer-motion'
import { Trash2, AlertTriangle } from 'lucide-react'
<<<<<<< HEAD
import { iconComponents, getCategoryIcon } from '../../utils/categoryIcons'
=======
import { getCategoryIcon } from '../../utils/categoryIcons'
>>>>>>> a40901cbfa97b0fcaaf6d09e4ee1037659ca3e41

const getBarColor = (percentage) => {
  if (percentage >= 100) return 'bg-red-500'
  if (percentage >= 75) return 'bg-yellow-500'
  return 'bg-primary'
}

const BudgetCard = ({ budget, onDelete, categories = [] }) => {
  const { category, monthlyLimit, spent, remaining, percentage } = budget
  const { icon: Icon, color, bg } = getCategoryIcon(category)
  const isOverBudget = percentage >= 100
  const clampedPercentage = Math.min(percentage, 100)

  // Default map se check karo, nahi mila toh custom categories mein dhundho
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
<<<<<<< HEAD
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${bg}`}
            style={customColor ? { backgroundColor: `${customColor}20` } : {}}
          >
            <Icon
              className={`w-5 h-5 ${color}`}
              style={customColor ? { color: customColor } : {}}
            />
=======
          <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${color}`} />
>>>>>>> a40901cbfa97b0fcaaf6d09e4ee1037659ca3e41
          </div>
          <div>
            <p className="text-[var(--text-primary)] font-medium">{category}</p>
            <p className="text-[var(--text-secondary)] text-xs">Monthly limit: ₹{monthlyLimit.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(budget._id)}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedPercentage}%` }}
          transition={{ duration: 0.6 }}
          className={`h-full rounded-full ${getBarColor(percentage)}`}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--text-secondary)]">
          ₹{spent.toLocaleString('en-IN')} spent
        </span>
        <span className={remaining < 0 ? 'text-red-400 font-medium' : 'text-[var(--text-primary)] font-medium'}>
          {remaining < 0 ? `₹${Math.abs(remaining).toLocaleString('en-IN')} over` : `₹${remaining.toLocaleString('en-IN')} left`}
        </span>
      </div>

      {isOverBudget && (
        <div className="flex items-center gap-1.5 mt-2.5 text-xs text-red-400 bg-red-500/10 rounded-lg px-2.5 py-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          Budget cross ho gaya hai!
        </div>
      )}
    </motion.div>
  )
}

export default BudgetCard