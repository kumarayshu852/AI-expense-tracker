import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Trash2, CheckCircle, Loader2, ArrowRight } from 'lucide-react'
import {
  getBillSplitById,
  addExpense,
  removeExpense,
  settleBillSplit,
} from '../services/billSplitService'

const AddExpenseModal = ({ isOpen, onClose, members, onAdd }) => {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(members[0]?.name || '')
  const [splitAmong, setSplitAmong] = useState(members.map((m) => m.name))
  const [loading, setLoading] = useState(false)

  const toggleMember = (name) => {
    setSplitAmong((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (splitAmong.length === 0) return
    setLoading(true)
    try {
      await onAdd({ title, amount: Number(amount), paidBy, splitAmong })
      setTitle('')
      setAmount('')
      setPaidBy(members[0]?.name || '')
      setSplitAmong(members.map((m) => m.name))
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative z-10 w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Add Expense</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Expense title (e.g. Hotel, Dinner)"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
              />

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
                placeholder="Amount (₹)"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
              />

              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Paid By</label>
                <div className="grid grid-cols-2 gap-2">
                  {members.map((m) => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => setPaidBy(m.name)}
                      className={`py-2 px-3 rounded-lg text-xs transition ${
                        paidBy === m.name
                          ? 'bg-primary text-white'
                          : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">
                  Split Among ({splitAmong.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {members.map((m) => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => toggleMember(m.name)}
                      className={`py-2 px-3 rounded-lg text-xs transition ${
                        splitAmong.includes(m.name)
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {splitAmong.includes(m.name) ? '✓ ' : ''}{m.name}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setSplitAmong(members.map((m) => m.name))}
                  className="mt-1.5 text-xs text-primary hover:underline"
                >
                  Select All
                </button>
              </div>

              {amount && splitAmong.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                  <p className="text-xs text-[var(--text-secondary)]">
                    Per person: <span className="text-primary font-medium">
                      ₹{(Number(amount) / splitAmong.length).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-sm text-[var(--text-secondary)] border border-[var(--border)] rounded-lg"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || splitAmong.length === 0}
                  className="flex-1 py-2.5 text-sm text-white bg-gradient-to-r from-primary to-accent-cyan rounded-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Expense'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

const BillSplitDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchData = async () => {
    try {
      const res = await getBillSplitById(id)
      setData(res.data.data)
    } catch (err) {
      console.error('Failed to fetch:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [id])

  const handleAddExpense = async (expenseData) => {
    await addExpense(id, expenseData)
    fetchData()
  }

  const handleRemoveExpense = async (expenseId) => {
    if (!window.confirm('Do you want to remove this expense?')) return
    try {
      await removeExpense(id, expenseId)
      fetchData()
    } catch (err) {
      console.error('Remove failed:', err)
    }
  }

  const handleSettle = async () => {
    if (!window.confirm('Is everything settled? Marked as settled?')) return
    try {
      await settleBillSplit(id)
      fetchData()
    } catch (err) {
      console.error('Settle failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!data) return null

  const { split, balances, settlements, totalAmount } = data

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/billsplit')}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]/40 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">{split.title}</h2>
          <p className="text-[var(--text-secondary)] text-sm">
            {split.members.length} members · Total ₹{totalAmount.toLocaleString('en-IN')}
          </p>
        </div>
        {!split.isSettled && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent-cyan text-white text-sm font-medium px-4 py-2.5 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </motion.button>
          </div>
        )}
      </div>

      {split.isSettled && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 mb-4 text-sm">
          <CheckCircle className="w-4 h-4" />
          This group has settled in!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Expenses List */}
        <div>
          <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-3">
            Expenses ({split.expenses.length})
          </h3>
          {split.expenses.length === 0 ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-8 text-center">
              <p className="text-[var(--text-secondary)] text-sm">There are no expenses — hit 'Add Expense'!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {split.expenses.map((exp) => (
                <div
                  key={exp._id}
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-[var(--text-primary)] text-sm font-medium">{exp.title}</p>
                    <p className="text-[var(--text-secondary)] text-xs mt-0.5">
                      Paid by <span className="text-primary font-medium">{exp.paidBy}</span>
                      {' '}· Split: {exp.splitAmong.join(', ')}
                    </p>
                    <p className="text-[var(--text-secondary)] text-xs">
                      ₹{(exp.amount / exp.splitAmong.length).toLocaleString('en-IN', { maximumFractionDigits: 2 })} per person
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[var(--text-primary)] font-semibold text-sm">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </span>
                    {!split.isSettled && (
                      <button
                        onClick={() => handleRemoveExpense(exp._id)}
                        className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settlement */}
        <div className="space-y-4">
          {/* Balances */}
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-3">Member Balances</h3>
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 space-y-2">
              {Object.entries(balances).map(([name, balance]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)] text-sm">{name}</span>
                  <span className={`text-sm font-medium ${
                    balance > 0.01 ? 'text-green-400' : balance < -0.01 ? 'text-red-400' : 'text-[var(--text-secondary)]'
                  }`}>
                    {balance > 0.01 ? '+' : ''}₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Settlements */}
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-3">
              Who Pays Whom? ({settlements.length} transactions)
            </h3>
            {settlements.length === 0 ? (
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 text-center">
                <p className="text-green-400 text-sm">✓ Everything is covered—no payment required!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {settlements.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 flex items-center gap-3"
                  >
                    <span className="text-[var(--text-primary)] text-sm font-medium">{s.from}</span>
                    <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-[var(--text-primary)] text-sm font-medium flex-1">{s.to}</span>
                    <span className="text-primary font-semibold text-sm">
                      ₹{s.amount.toLocaleString('en-IN')}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Settle Button */}
          {!split.isSettled && split.expenses.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSettle}
              className="w-full flex items-center justify-center gap-2 bg-green-500/20 text-green-400 border border-green-500/30 font-medium py-3 rounded-xl text-sm transition hover:bg-green-500/30"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as Settled
            </motion.button>
          )}
        </div>
      </div>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        members={split.members}
        onAdd={handleAddExpense}
      />
    </div>
  )
}

export default BillSplitDetail