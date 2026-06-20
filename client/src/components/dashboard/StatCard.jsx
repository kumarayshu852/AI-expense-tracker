import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const StatCard = ({ icon: Icon, label, value, change, iconColor = 'text-primary', iconBg = 'bg-primary/10' }) => {
  const [displayValue, setDisplayValue] = useState(0)

  // Animated counter — 0 se actual value tak smoothly chadhta hai
  useEffect(() => {
    const duration = 800
    const startTime = performance.now()

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      setDisplayValue(Math.floor(progress * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value])

  const isPositive = change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 transition-colors"
    >
      <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center mb-3`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <p className="text-[var(--text-secondary)] text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-[var(--text-primary)]">
        ₹{displayValue.toLocaleString('en-IN')}
      </p>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(change)}% from last month
        </div>
      )}
    </motion.div>
  )
}

export default StatCard