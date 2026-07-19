import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, TrendingUp, RefreshCw } from 'lucide-react'
import { getHealthScore } from '../../services/healthScoreService'

const ScoreRing = ({ score, grade, gradeColor }) => {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 136 136">
        {/* Background ring */}
        <circle
          cx="68" cy="68" r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="10"
        />
        {/* Score ring */}
        <motion.circle
          cx="68" cy="68" r={radius}
          fill="none"
          stroke={gradeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl font-bold"
          style={{ color: gradeColor }}
        >
          {score}
        </motion.span>
        <span className="text-[var(--text-secondary)] text-xs">/ 100</span>
        <span
          className="text-lg font-bold mt-0.5"
          style={{ color: gradeColor }}
        >
          {grade}
        </span>
      </div>
    </div>
  )
}

const BreakdownBar = ({ label, score, max, value }) => {
  const percentage = (score / max) * 100
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[var(--text-secondary)] text-xs">{label}</span>
        <span className="text-[var(--text-primary)] text-xs font-medium">{score}/{max}</span>
      </div>
      <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-full rounded-full bg-primary"
        />
      </div>
      {value && <p className="text-[var(--text-secondary)] text-xs mt-0.5">{value}</p>}
    </div>
  )
}

const HealthScoreCard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchScore = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const res = await getHealthScore()
      setData(res.data.data)
    } catch (err) {
      console.error('Health score fetch error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchScore()
  }, [])

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-[var(--text-primary)] font-semibold text-sm">Financial Health Score</h3>
        </div>
        <button
          onClick={() => fetchScore(true)}
          disabled={refreshing}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]/40 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : !data ? (
        <div className="text-center py-8">
          <p className="text-[var(--text-secondary)] text-sm">The score could not be loaded.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Score ring */}
          <ScoreRing
            score={data.totalScore}
            grade={data.grade}
            gradeColor={data.gradeColor}
          />

          {/* AI Feedback */}
          <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
            <p className="text-[var(--text-secondary)] text-xs leading-relaxed">{data.aiFeedback}</p>
          </div>

          {/* Breakdown */}
          <div className="space-y-2.5">
            {Object.values(data.breakdown).map((item) => (
              <BreakdownBar
                key={item.label}
                label={item.label}
                score={item.score}
                max={item.max}
                value={item.value}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HealthScoreCard