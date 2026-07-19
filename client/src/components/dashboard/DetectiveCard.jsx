import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Search, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { getDetectiveAnalysis } from '../../services/detectiveService'

const DetectiveCard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAnalysis = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const res = await getDetectiveAnalysis()
      setData(res.data.data)
    } catch (err) {
      console.error('Detective fetch error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalysis()
  }, [])

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          <h3 className="text-[var(--text-primary)] font-semibold text-sm">Where did the money go?</h3>
        </div>
        <button
          onClick={() => fetchAnalysis(true)}
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
          <p className="text-[var(--text-secondary)] text-sm">The analysis could not be loaded.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Month comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
              <p className="text-[var(--text-secondary)] text-xs mb-1">This Month</p>
              <p className="text-[var(--text-primary)] font-semibold">
                ₹{data.patterns.currentTotal.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
              <p className="text-[var(--text-secondary)] text-xs mb-1">Last Month</p>
              <p className="text-[var(--text-primary)] font-semibold">
                ₹{data.patterns.lastTotal.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Month diff */}
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
            data.patterns.monthDiff > 0
              ? 'bg-red-500/10 text-red-400'
              : 'bg-green-500/10 text-green-400'
          }`}>
            {data.patterns.monthDiff > 0
              ? <TrendingUp className="w-4 h-4 shrink-0" />
              : <TrendingDown className="w-4 h-4 shrink-0" />
            }
            <p className="text-xs font-medium">
              {data.patterns.monthDiff > 0 ? 'Pichle mahine se ' : 'Pichle mahine se '}
              ₹{Math.abs(data.patterns.monthDiff).toLocaleString('en-IN')}
              {' '}{data.patterns.monthDiff > 0 ? 'zyada' : 'kam'} kharch
              {' '}({Math.abs(data.patterns.monthDiffPercent)}%)
            </p>
          </div>

          {/* Weekend vs Weekday */}
          <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
            <p className="text-[var(--text-secondary)] text-xs mb-2">Weekend vs Weekday (daily avg)</p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--text-secondary)]">Weekend</span>
                  <span className="text-[var(--text-primary)] font-medium">₹{data.patterns.avgWeekendDaily.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: data.patterns.avgWeekendDaily > data.patterns.avgWeekdayDaily ? '100%' : `${(data.patterns.avgWeekendDaily / Math.max(data.patterns.avgWeekendDaily, data.patterns.avgWeekdayDaily)) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-orange-400 rounded-full"
                  />
                </div>
              </div>
              <span className="text-[var(--text-secondary)] text-xs">vs</span>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--text-secondary)]">Weekday</span>
                  <span className="text-[var(--text-primary)] font-medium">₹{data.patterns.avgWeekdayDaily.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: data.patterns.avgWeekdayDaily > data.patterns.avgWeekendDaily ? '100%' : `${(data.patterns.avgWeekdayDaily / Math.max(data.patterns.avgWeekendDaily, data.patterns.avgWeekdayDaily)) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-blue-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top category changes */}
          {data.patterns.categoryChanges.length > 0 && (
            <div>
              <p className="text-[var(--text-secondary)] text-xs mb-2">Category Changes</p>
              <div className="space-y-1.5">
                {data.patterns.categoryChanges.slice(0, 3).map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)] text-xs truncate flex-1">{cat.category}</span>
                    <span className={`text-xs font-medium ml-2 ${cat.diff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {cat.diff > 0 ? '+' : ''}₹{cat.diff.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Detective Analysis */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-[var(--text-primary)] text-xs leading-relaxed whitespace-pre-wrap">
              {data.analysis}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetectiveCard