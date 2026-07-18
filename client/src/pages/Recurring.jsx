import { useEffect, useState } from 'react'
import { Plus, Loader2, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import RecurringForm from '../components/recurring/RecurringForm'
import RecurringCard from '../components/recurring/RecurringCard'
import { getRecurring, createRecurring, toggleRecurring, deleteRecurring, triggerProcess } from '../services/recurringService'
import { getCategories } from '../services/categoryService'

const Recurring = () => {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [processing, setProcessing] = useState(false)

  const fetchData = async () => {
    try {
      const [recRes, catRes] = await Promise.all([
        getRecurring(),
        getCategories(),
      ])
      setTransactions(recRes.data.data.transactions)
      setCategories(catRes.data.data.categories)
    } catch (err) {
      console.error('Failed to fetch:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (formData) => {
    await createRecurring(formData)
    fetchData()
  }

  const handleToggle = async (id) => {
    try {
      await toggleRecurring(id)
      fetchData()
    } catch (err) {
      console.error('Toggle failed:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Do you want to delete this recurring transaction?')) return
    try {
      await deleteRecurring(id)
      fetchData()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const handleProcess = async () => {
    setProcessing(true)
    try {
      await triggerProcess()
      fetchData()
      alert('Recurring transactions processed successfully!')
    } catch (err) {
      console.error('Process failed:', err)
    } finally {
      setProcessing(false)
    }
  }

  const active = transactions.filter((t) => t.isActive)
  const paused = transactions.filter((t) => !t.isActive)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">Recurring Transactions</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-0.5">
            {active.length} active · {paused.length} paused
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleProcess}
            disabled={processing}
            className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm px-3 py-2.5 rounded-lg disabled:opacity-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
            Process Now
          </button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent-cyan text-white text-sm font-medium px-4 py-2.5 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Recurring
          </motion.button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-60">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-10 text-center">
          <p className="text-[var(--text-secondary)] text-sm">There are no recurring transactions. Add a new one!</p>
          <p className="text-[var(--text-secondary)] text-xs mt-1">For example: monthly rent, salary, EMI, Netflix subscription.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div>
              <h3 className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wider mb-3">
                Active ({active.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {active.map((t) => (
                  <RecurringCard
                    key={t._id}
                    transaction={t}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    categories={categories}
                  />
                ))}
              </div>
            </div>
          )}

          {paused.length > 0 && (
            <div>
              <h3 className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wider mb-3">
                Paused ({paused.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paused.map((t) => (
                  <RecurringCard
                    key={t._id}
                    transaction={t}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    categories={categories}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <RecurringForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default Recurring