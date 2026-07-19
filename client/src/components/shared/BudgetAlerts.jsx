import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, TrendingUp } from 'lucide-react'
import { getBudgets } from '../../services/budgetService'

const BudgetAlerts = () => {
  const [alerts, setAlerts] = useState([])
  const [dismissed, setDismissed] = useState([])
  const hasFetched = useRef(false)

  useEffect(() => {
    // Sirf ek baar fetch karo — ref se ensure karo
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchBudgets = async () => {
      try {
        const res = await getBudgets()
        const budgets = res.data.data.budgets
        const overBudgets = budgets.filter(
          (b) => b.percentage >= 80 && b.monthlyLimit > 0
        )
        setAlerts(overBudgets)
      } catch (err) {
        console.error('Budget alert fetch error:', err)
      }
    }

    fetchBudgets()
  }, []) // Empty array — sirf mount pe ek baar

  const visibleAlerts = alerts.filter((a) => !dismissed.includes(a._id))

  if (visibleAlerts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {visibleAlerts.slice(0, 3).map((alert) => (
          <motion.div
            key={alert._id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 rounded-xl p-4 shadow-xl border ${
              alert.percentage >= 100
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-yellow-500/10 border-yellow-500/30'
            }`}
          >
            <div className={`shrink-0 mt-0.5 ${alert.percentage >= 100 ? 'text-red-400' : 'text-yellow-400'}`}>
              {alert.percentage >= 100
                ? <TrendingUp className="w-4 h-4" />
                : <AlertTriangle className="w-4 h-4" />
              }
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${alert.percentage >= 100 ? 'text-red-400' : 'text-yellow-400'}`}>
                {alert.percentage >= 100 ? 'Budget Exceed!' : 'Budget Warning!'}
              </p>
              <p className="text-[var(--text-secondary)] text-xs mt-0.5">
                <span className="text-[var(--text-primary)] font-medium">{alert.category}</span>
                {' '}— {alert.percentage}% used
                {' '}(₹{alert.spent.toLocaleString('en-IN')} of ₹{alert.monthlyLimit.toLocaleString('en-IN')})
              </p>
              <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${alert.percentage >= 100 ? 'bg-red-500' : 'bg-yellow-500'}`}
                  style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setDismissed((prev) => [...prev, alert._id])}
              className="shrink-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {visibleAlerts.length > 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-[var(--text-secondary)] bg-[var(--bg-card)] border border-[var(--border)] rounded-lg py-2"
        >
          +{visibleAlerts.length - 3} more budget alerts
        </motion.div>
      )}
    </div>
  )
}

export default BudgetAlerts