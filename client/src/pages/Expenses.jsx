import { useEffect, useState } from 'react'
import { Plus, Loader2, Download, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import ExpenseForm from '../components/expenses/ExpenseForm'
import ExpenseTable from '../components/expenses/ExpenseTable'
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../services/expenseService'
import { exportToCSV, exportToPDF } from '../utils/exportReports'

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)

  const fetchExpenses = async () => {
    try {
      const res = await getExpenses()
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

  // Summary calculate karo PDF mein dikhane ke liye
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
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

      {loading ? (
        <div className="flex items-center justify-center h-60">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <ExpenseTable expenses={expenses} onEdit={handleEditClick} onDelete={handleDelete} />
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