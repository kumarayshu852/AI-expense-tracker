import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import ExpenseTable from './ExpenseTable'

const MonthAccordion = ({ group, defaultOpen = false, onEdit, onDelete, categories }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--bg-secondary)]/40 transition"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[var(--text-primary)] font-semibold">{group.label}</span>
          <span className="text-[var(--text-secondary)] text-xs">({group.expenses.length} entries)</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-primary font-semibold text-sm">₹{group.total.toLocaleString('en-IN')} spent</span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-[var(--border)]">
              <ExpenseTable
                expenses={group.expenses}
                onEdit={onEdit}
                onDelete={onDelete}
                categories={categories}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MonthAccordion