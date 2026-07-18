import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Plus, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import { iconComponents } from '../../utils/categoryIcons'

const GoalCard = ({ goal, onDelete, onAddMoney }) => {
  const {
    title, targetAmount, savedAmount, percentage,
    remaining, daysLeft, isOverdue, monthlyNeeded,
    isCompleted, color, icon,
  } = goal

  const [showAddMoney, setShowAddMoney] = useState(false)
  const [addAmount, setAddAmount] = useState('')

  const IconComp = iconComponents[icon] || iconComponents.Package

  const getBarColor = () => {
    if (isCompleted) return 'bg-green-500'
    if (isOverdue) return 'bg-red-500'
    if (percentage >= 75) return 'bg-primary'
    return 'bg-primary'
  }

  const handleAddMoney = async () => {
    if (!addAmount || Number(addAmount) <= 0) return
    await onAddMoney(goal._id, Number(addAmount))
    setAddAmount('')
    setShowAddMoney(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color}20` }}
          >
            <IconComp className="w-5 h-5" style={{ color }} />
          </div>
          <div>
            <p className="text-[var(--text-primary)] font-medium">{title}</p>
            <p className="text-[var(--text-secondary)] text-xs">
              ₹{savedAmount.toLocaleString('en-IN')} / ₹{targetAmount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!isCompleted && (
            <button
              onClick={() => setShowAddMoney(!showAddMoney)}
              className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-primary hover:bg-primary/10 transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => onDelete(goal._id)}
            className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8 }}
          className={`h-full rounded-full ${getBarColor()}`}
          style={!isCompleted && !isOverdue ? { backgroundColor: color } : {}}
        />
      </div>

      <div className="flex items-center justify-between text-xs mb-3">
        <span className="text-[var(--text-secondary)]">{percentage}% complete</span>
        <span className="text-[var(--text-primary)] font-medium">
          ₹{remaining.toLocaleString('en-IN')} remaining
        </span>
      </div>

      {/* Status */}
      {isCompleted ? (
        <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 rounded-lg px-2.5 py-1.5">
          <CheckCircle className="w-3.5 h-3.5" />
          Goal achieved! 
        </div>
      ) : isOverdue ? (
        <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 rounded-lg px-2.5 py-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
         The deadline has passed!  ₹{monthlyNeeded.toLocaleString('en-IN')} Add it now.
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-lg px-2.5 py-1.5">
          <Clock className="w-3.5 h-3.5" />
          {daysLeft} days left · ₹{monthlyNeeded.toLocaleString('en-IN')}/I need the month.
        </div>
      )}

      {/* Add money inline form */}
      {showAddMoney && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-[var(--border)] flex gap-2"
        >
          <input
            type="number"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            placeholder="Amount add karo"
            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleAddMoney}
            disabled={!addAmount || Number(addAmount) <= 0}
            className="bg-gradient-to-r from-primary to-accent-cyan text-white text-sm px-3 py-2 rounded-lg disabled:opacity-50"
          >
            Add
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default GoalCard