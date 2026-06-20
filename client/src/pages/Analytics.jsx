import { useEffect, useState } from 'react'
import { Loader2, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import MonthSelector from '../components/analytics/MonthSelector'
import CategoryBarChart from '../components/analytics/CategoryBarChart'
import ExpenseLineChart from '../components/dashboard/ExpenseLineChart'
import { getDashboardStats, getCategoryBreakdown, getDailyTrend } from '../services/analyticsService'

const now = new Date()

const Analytics = () => {
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [stats, setStats] = useState({ totalIncome: 0, totalExpenses: 0, savings: 0 })
  const [categories, setCategories] = useState([])
  const [trend, setTrend] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = { month, year }
        const [statsRes, catRes, trendRes] = await Promise.all([
          getDashboardStats(params),
          getCategoryBreakdown(params),
          getDailyTrend(params),
        ])

        setStats(statsRes.data.data)
        setCategories(
          catRes.data.data.categories.map((c) => ({ name: c._id, value: c.total }))
        )
        setTrend(
          trendRes.data.data.trend.map((t) => ({
            date: new Date(t._id).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            amount: t.total,
          }))
        )
      } catch (err) {
        console.error('Analytics fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [month, year])

  const handleMonthChange = (m, y) => {
    setMonth(m)
    setYear(y)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">Analytics</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-0.5">Get a deep understanding of your spending patterns.</p>
        </div>
        <MonthSelector month={month} year={year} onChange={handleMonthChange} />
      </div>

      {/* Quick summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-[var(--text-secondary)] text-xs">Total Spent</p>
            <p className="text-[var(--text-primary)] font-semibold">₹{stats.totalExpenses.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-[var(--text-secondary)] text-xs">Total Income</p>
            <p className="text-[var(--text-primary)] font-semibold">₹{stats.totalIncome.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-accent-cyan" />
          </div>
          <div>
            <p className="text-[var(--text-secondary)] text-xs">Net Savings</p>
            <p className={`font-semibold ${stats.savings < 0 ? 'text-red-400' : 'text-[var(--text-primary)]'}`}>
              ₹{stats.savings.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      {categories.length === 0 && trend.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-10 text-center">
          <p className="text-[var(--text-secondary)] text-sm">No data available for this month.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ExpenseLineChart data={trend} />
          <CategoryBarChart data={categories} />
        </div>
      )}
    </div>
  )
}

export default Analytics