import { useEffect, useMemo, useState } from 'react'
import { Plus, Loader2, Download, FileText, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import ExpenseForm from '../components/expenses/ExpenseForm'
import MonthAccordion from '../components/expenses/MonthAccordion'
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../services/expenseService'
import { exportToCSV, exportToPDF } from '../utils/exportReports'
import { groupExpensesByMonth, formatDateForSearch } from '../utils/groupByMonth'

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

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
    fetchExpenses()
  }, [])

  const handleAddClick = () => {
    setEditingExpense(null)
    setIsFormOpen(true)
  }

  const handleEditClick = (expense) => {
    setEditingExpense(expense)
    setIsFormOpen(true)
  }

  const handleSubmit = async (formData) => {
    if (editingExpense) {
      await updateExpense(editingExpense._id, formData)
    } else {
      await createExpense(formData)
    }
    fetchExpenses()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction')) return
    try {
      await deleteExpense(id)
      fetchExpenses()
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  // Search query se date match karo — jaise "14/6" type karne par 14/6/2026 wali entries dikhe
  const filteredExpenses = useMemo(() => {
    if (!searchQuery.trim()) return expenses
    const query = searchQuery.trim().toLowerCase()
    return expenses.filter((exp) => {
      const dateStr = formatDateForSearch(exp.date)
      return dateStr.includes(query) || exp.title.toLowerCase().includes(query)
    })
  }, [expenses, searchQuery])

  const monthGroups = useMemo(() => groupExpensesByMonth(filteredExpenses), [filteredExpenses])

  // Summary PDF export ke liye
  const summary = expenses.reduce(
    (acc, e) => {
      if (e.type === 'income') acc.totalIncome += e.amount
      else acc.totalExpenses += e.amount
      return acc
    },
    { totalIncome: 0, totalExpenses: 0 }
  )
  summary.savings = summary.totalIncome - summary.totalExpenses

  const handleExportCSV = () => exportToCSV(expenses, 'expenses-report')
  const handleExportPDF = () => exportToPDF(expenses, summary, 'expenses-report')

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">All Transactions</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-0.5">Manage your income and expenses</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={!expenses.length}
            className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm px-3 py-2.5 rounded-lg disabled:opacity-50 transition"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>

          <button
            onClick={handleExportPDF}
            disabled={!expenses.length}
            className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm px-3 py-2.5 rounded-lg disabled:opacity-50 transition"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>

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
          <p className="text-[var(--text-secondary)] text-sm">No transactions found</p>
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