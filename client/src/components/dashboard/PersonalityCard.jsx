import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw, Sparkles } from 'lucide-react'
import { getPersonality } from '../../services/personalityService'

const PersonalityCard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchPersonality = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const res = await getPersonality()
      setData(res.data.data)
    } catch (err) {
      console.error('Personality fetch error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchPersonality() }, [])

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-[var(--text-primary)] font-semibold text-sm">Spending Personality</h3>
        </div>
        <button
          onClick={() => fetchPersonality(true)}
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
          <p className="text-[var(--text-secondary)] text-sm">Data could not be loaded.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Primary Personality */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: `${data.primary.color}15`, border: `1px solid ${data.primary.color}30` }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-5xl mb-2"
            >
              {data.primary.emoji}
            </motion.div>
            <h4
              className="text-lg font-bold mb-1"
              style={{ color: data.primary.color }}
            >
              {data.primary.name}
            </h4>
            <p className="text-[var(--text-secondary)] text-xs">
              {data.primary.description}
            </p>
          </motion.div>

          {/* Secondary Personality */}
          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-lg px-3 py-2">
            <span className="text-lg">{data.secondary.emoji}</span>
            <div>
              <p className="text-[var(--text-secondary)] text-xs">Secondary trait</p>
              <p className="text-[var(--text-primary)] text-xs font-medium">{data.secondary.name}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[var(--bg-secondary)] rounded-lg p-2 text-center">
              <p className="text-[var(--text-primary)] font-semibold text-sm">
                {Math.round(data.data.savingsRate)}%
              </p>
              <p className="text-[var(--text-secondary)] text-xs">Savings</p>
            </div>
            <div className="bg-[var(--bg-secondary)] rounded-lg p-2 text-center">
              <p className="text-[var(--text-primary)] font-semibold text-sm">
                {data.data.transactionCount}
              </p>
              <p className="text-[var(--text-secondary)] text-xs">Transactions</p>
            </div>
            <div className="bg-[var(--bg-secondary)] rounded-lg p-2 text-center">
              <p className="text-[var(--text-primary)] font-semibold text-sm">
                {data.data.topCategory?.percent || 0}%
              </p>
              <p className="text-[var(--text-secondary)] text-xs truncate">
                {data.data.topCategory?.name?.split(' ')[0] || 'N/A'}
              </p>
            </div>
          </div>

          {/* AI Tips */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
              {data.aiTips}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PersonalityCard