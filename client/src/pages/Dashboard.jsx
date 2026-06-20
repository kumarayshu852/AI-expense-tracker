import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, PiggyBank, Target, Loader2 } from 'lucide-react'
import StatCard from '../components/dashboard/StatCard'
import ExpenseLineChart from '../components/dashboard/ExpenseLineChart'
import CategoryDonutChart from '../components/dashboard/CategoryDonutChart'
import { getDashboardStats, getCategoryBreakdown, getDailyTrend } from '../services/analyticsService'
import { getBudgets } from '../services/budgetService'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({ totalIncome: 0, totalExpenses: 0, savings: 0 })
  const [trend, setTrend] = useState([])
  const [categories, setCategories] = useState([])
  const [budgetLeft, setBudgetLeft] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, catRes, trendRes, budgetRes] = await Promise.all([
          getDashboardStats(),
          getCategoryBreakdown(),
          getDailyTrend(),
          getBudgets(),
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

        const remaining = budgetRes.data.data.budgets.reduce((sum, b) => sum + b.remaining, 0)
        setBudgetLeft(remaining)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <p className="text-[var(--text-secondary)] text-sm">Welcome back, {user?.name}! Here's your financial overview.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Wallet} label="Total Expenses" value={stats.totalExpenses} iconColor="text-red-400" iconBg="bg-red-500/10" />
        <StatCard icon={TrendingUp} label="Total Income" value={stats.totalIncome} iconColor="text-green-400" iconBg="bg-green-500/10" />
        <StatCard icon={PiggyBank} label="Savings" value={stats.savings} iconColor="text-accent-cyan" iconBg="bg-cyan-500/10" />
        <StatCard icon={Target} label="Budget Left" value={budgetLeft} iconColor="text-primary" iconBg="bg-primary/10" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpenseLineChart data={trend} />
        <CategoryDonutChart data={categories} />
      </div>
    </div>
  )
}

export default Dashboard