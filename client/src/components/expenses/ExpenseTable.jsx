import { motion } from 'framer-motion'
import { Pencil, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { iconComponents, getCategoryIcon } from '../../utils/categoryIcons'

const ExpenseTable = ({ expenses = [], onEdit, onDelete, categories = [] }) => {

  // Category name se icon+color find karo (default + custom dono handle karta hai)
  const getIcon = (categoryName) => {
    // Pehle default map check karo
    const defaultIcon = getCategoryIcon(categoryName)
    if (defaultIcon && defaultIcon.icon !== iconComponents.Package) return defaultIcon

    // Custom category — API se aaye categories mein dhundho
    const custom = categories.find((c) => c.name === categoryName)
    if (custom) {
      const IconComp = iconComponents[custom.icon] || iconComponents.Package
      return {
        icon: IconComp,
        color: '',
        bg: '',
        customColor: custom.color,
      }
    }

    return { icon: iconComponents.Package, color: 'text-gray-400', bg: 'bg-gray-500/10' }
  }

  const renderIcon = (categoryName) => {
    const { icon: Icon, color, bg, customColor } = getIcon(categoryName)
    return (
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bg}`}
        style={customColor ? { backgroundColor: `${customColor}20` } : {}}
      >
        <Icon
          className={`w-4 h-4 ${color}`}
          style={customColor ? { color: customColor } : {}}
        />
      </div>
    )
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-10 text-center">
        <p className="text-[var(--text-secondary)] text-sm">Koi transaction nahi mila. Upar se naya add karo!</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile: Card list */}
      <div className="md:hidden space-y-3">
        {expenses.map((exp, i) => (
          <motion.div
            key={exp._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                {renderIcon(exp.category)}
                <div className="min-w-0">
                  <p className="text-[var(--text-primary)] font-medium truncate">{exp.title}</p>
                  <p className="text-[var(--text-secondary)] text-xs">{exp.category} · {exp.paymentMethod}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onEdit(exp)}
                  className="p-2 rounded-md text-[var(--text-secondary)] hover:text-primary hover:bg-primary/10 transition"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(exp._id)}
                  className="p-2 rounded-md text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
              <span className="text-[var(--text-secondary)] text-xs">
                {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className={`flex items-center gap-1 font-medium text-sm ${exp.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                {exp.type === 'income' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                ₹{exp.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:block bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
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
                    {renderIcon(exp.category)}
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
    </>
  )
}

export default ExpenseTable