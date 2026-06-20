import { useEffect, useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import BudgetForm from '../components/budgets/BudgetForm'
import BudgetCard from '../components/budgets/BudgetCard'
import { getBudgets, createBudget, deleteBudget } from '../services/budgetService'

const Budgets = () => {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchBudgets = async () => {
    try {
      const res = await getBudgets()
      setBudgets(res.data.data.budgets)
    } catch (err) {
      console.error('Failed to fetch budgets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [])

  const handleSubmit = async (formData) => {
    await createBudget(formData)
    fetchBudgets()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('you want to delete this budget')) return
    try {
      await deleteBudget(id)
      fetchBudgets()
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  const existingCategories = budgets.map((b) => b.category)
  const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">Monthly Budgets</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-0.5">
            ₹{totalSpent.toLocaleString('en-IN')} spent of ₹{totalBudget.toLocaleString('en-IN')} total budget
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent-cyan text-white text-sm font-medium px-4 py-2.5 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Set Budget
        </motion.button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-60">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : budgets.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-10 text-center">
          <p className="text-[var(--text-secondary)] text-sm">No budget set for this month. Create a new one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <BudgetCard key={budget._id} budget={budget} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <BudgetForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        existingCategories={existingCategories}
      />
    </div>
  )
}

export default Budgets