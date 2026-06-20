import { motion } from 'framer-motion'
import { Pencil, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const categoryEmoji = {
  'Food & Dining': '🍔',
  'Transport': '🚗',
  'Shopping': '🛍️',
  'Bills & Utilities': '💡',
  'Entertainment': '🎬',
  'Health': '🏥',
  'Education': '📚',
  'Travel': '✈️',
  'Investment': '📈',
  'Income': '💰',
  'Others': '📦',
}

const ExpenseTable = ({ expenses = [], onEdit, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-10 text-center">
        <p className="text-[var(--text-secondary)] text-sm">No transactions found. Add a new one above!</p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-left">
            <th className="px-5 py-3 text-[var(--text-secondary)] font-medium">Transaction</th>
            <th className="px-5 py-3 text-[var(--text-secondary)] font-medium">Category</th>
            <th className="px-5 py-3 text-[var(--text-secondary)] font-medium">Payment</th>
            <th className="px-5 py-3 text-[var(--text-secondary)] font-medium">Date</th>
            <th className="px-5 py-3 text-[var(--text-secondary)] font-medium text-right">Amount</th>
            <th className="px-5 py-3 text-[var(--text-secondary)] font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp, i) => (
            <motion.tr
              key={exp._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-secondary)]/50 transition"
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{categoryEmoji[exp.category] || '📦'}</span>
                  <div>
                    <p className="text-[var(--text-primary)] font-medium">{exp.title}</p>
                    {exp.notes && <p className="text-[var(--text-secondary)] text-xs">{exp.notes}</p>}
                  </div>
                </div>
              </td>
              <td className="px-5 py-3.5 text-[var(--text-secondary)]">{exp.category}</td>
              <td className="px-5 py-3.5 text-[var(--text-secondary)]">{exp.paymentMethod}</td>
              <td className="px-5 py-3.5 text-[var(--text-secondary)]">
                {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
              <td className="px-5 py-3.5 text-right">
                <span className={`flex items-center justify-end gap-1 font-medium ${exp.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {exp.type === 'income' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  ₹{exp.amount.toLocaleString('en-IN')}
                </span>
              </td>
              <td className="px-5 py-3.5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(exp)}
                    className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-primary hover:bg-primary/10 transition"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(exp._id)}
                    className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExpenseTable