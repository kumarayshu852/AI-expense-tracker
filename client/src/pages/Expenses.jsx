import { useEffect, useMemo, useState } from 'react'
import { Plus, Loader2, Download, FileText, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import ExpenseForm from '../components/expenses/ExpenseForm'
import MonthAccordion from '../components/expenses/MonthAccordion'
import FilterBar from '../components/expenses/FilterBar'
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../services/expenseService'
import { getCategories } from '../services/categoryService'
import { exportToCSV, exportToPDF } from '../utils/exportReports'
import { groupExpensesByMonth, formatDateForSearch } from '../utils/groupByMonth'

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
const [filters, setFilters] = useState({ type: 'all', category: 'all', startDate: '', endDate: '' })


  const fetchExpenses = async () => {
    try {
      // Saari transactions ek baar mein fetch karo (month-wise grouping ke liye), pagination skip
      const res = await getExpenses({ limit: 1000 })
      setExpenses(res.data.data.expenses)
    } catch (err) {
      console.error('Failed to fetch expenses:', err)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    const init = async () => {
      try {
        const [expRes, catRes] = await Promise.all([
          getExpenses({ limit: 1000 }),
          getCategories(),
        ])
        setExpenses(expRes.data.data.expenses)
        setCategories(catRes.data.data.categories)
      } catch (err) {
        console.error('Failed to fetch:', err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const refetch = async () => {
    try {
      const [expRes, catRes] = await Promise.all([
        getExpenses({ limit: 1000 }),
        getCategories(),
      ])
      setExpenses(expRes.data.data.expenses)
      setCategories(catRes.data.data.categories)
    } catch (err) {
      console.error('Refetch error:', err)
    }
  }

  const handleAddClick = () => { setEditingExpense(null); setIsFormOpen(true) }
  const handleEditClick = (expense) => { setEditingExpense(expense); setIsFormOpen(true) }

  const handleSubmit = async (formData) => {
    if (editingExpense) await updateExpense(editingExpense._id, formData)
    else await createExpense(formData)
    refetch()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yeh transaction delete karna hai?')) return
    try { await deleteExpense(id); refetch() }
    catch (err) { console.error('Failed to delete:', err) }
  }

  // Search + Filter logic
  const filteredExpenses = useMemo(() => {
    let result = expenses

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter((e) => e.type === filters.type)
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter((e) => e.category === filters.category)
    }

    // Date range filter
    if (filters.startDate) {
      result = result.filter((e) => new Date(e.date) >= new Date(filters.startDate))
    }
    if (filters.endDate) {
      result = result.filter((e) => new Date(e.date) <= new Date(filters.endDate + 'T23:59:59'))
    }

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      result = result.filter((exp) => {
        const dateStr = formatDateForSearch(exp.date)
        return dateStr.includes(query) || exp.title.toLowerCase().includes(query)
      })
    }

    return result
  }, [expenses, filters, searchQuery])

  const monthGroups = useMemo(() => groupExpensesByMonth(filteredExpenses), [filteredExpenses])

  const summary = expenses.reduce(
    (acc, e) => {
      if (e.type === 'income') acc.totalIncome += e.amount
      else acc.totalExpenses += e.amount
      return acc
    },
    { totalIncome: 0, totalExpenses: 0 }
  )
  summary.savings = summary.totalIncome - summary.totalExpenses

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">All Transactions</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-0.5">
            {filteredExpenses.length} transactions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(expenses, 'expenses-report')}
            disabled={!expenses.length}
            className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm px-3 py-2.5 rounded-lg disabled:opacity-50 transition"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>

          <button
            onClick={() => exportToPDF(expenses, summary, 'expenses-report')}
            disabled={!expenses.length}
            className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm px-3 py-2.5 rounded-lg disabled:opacity-50 transition"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>

          <FilterBar
            onFilter={setFilters}
            categories={categories}
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent-cyan text-white text-sm font-medium px-4 py-2.5 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add
          </motion.button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by date (e.g. 14/6) or title..."
          className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-primary"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-60">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : monthGroups.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-10 text-center">
          <p className="text-[var(--text-secondary)] text-sm">No transaction found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {monthGroups.map((group, i) => (
            <MonthAccordion
              key={group.key}
              group={group}
              defaultOpen={i === 0}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              categories={categories}
            />
          ))}
        </div>
      )}

      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingExpense}
      />
    </div>
  )
}

export default Expenses