import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Loader2, Users, Trash2, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getBillSplits, createBillSplit, deleteBillSplit } from '../services/billSplitService'

const CreateGroupModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('')
  const [members, setMembers] = useState(['', ''])
  const [loading, setLoading] = useState(false)

  const addMember = () => setMembers([...members, ''])
  const removeMember = (i) => setMembers(members.filter((_, idx) => idx !== i))
  const updateMember = (i, val) => {
    const updated = [...members]
    updated[i] = val
    setMembers(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validMembers = members.filter((m) => m.trim())
    if (validMembers.length < 2) return
    setLoading(true)
    try {
      await onCreate({ title, members: validMembers })
      setTitle('')
      setMembers(['', ''])
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
            className="relative z-10 w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-2xl"
          >
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5">New Bill Split Group</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">Group Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Goa Trip, Office Lunch, Party"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-2 block">Members (min 2)</label>
                <div className="space-y-2">
                  {members.map((m, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={m}
                        onChange={(e) => updateMember(i, e.target.value)}
                        placeholder={`Member ${i + 1} naam`}
                        className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary"
                      />
                      {members.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeMember(i)}
                          className="px-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addMember}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  + Add a member
                </button>
              </div>

              <div className="flex gap-2 pt-1">
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
                  disabled={loading}
                  className="flex-1 py-2.5 text-sm text-white bg-gradient-to-r from-primary to-accent-cyan rounded-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Group'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

const BillSplits = () => {
  const [splits, setSplits] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const fetchSplits = async () => {
    try {
      const res = await getBillSplits()
      setSplits(res.data.data.splits)
    } catch (err) {
      console.error('Failed to fetch:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSplits() }, [])

  const handleCreate = async (data) => {
    await createBillSplit(data)
    fetchSplits()
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Do you want to delete this group?')) return
    try {
      await deleteBillSplit(id)
      fetchSplits()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">Bill Split</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-0.5">Group expenses split easily</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent-cyan text-white text-sm font-medium px-4 py-2.5 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          New Group
        </motion.button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-60">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : splits.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-10 text-center">
          <Users className="w-10 h-10 text-[var(--text-secondary)] mx-auto mb-3" />
          <p className="text-[var(--text-primary)] font-medium mb-1">There is no group.</p>
          <p className="text-[var(--text-secondary)] text-sm">Create a new group for a trip, party, or outing!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {splits.map((split) => (
            <motion.div
              key={split._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/billsplit/${split._id}`)}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 cursor-pointer hover:border-primary/50 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[var(--text-primary)] font-medium">{split.title}</p>
                  <p className="text-[var(--text-secondary)] text-xs mt-0.5">
                    {split.members.length} members · {split.expenses.length} expenses
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {split.isSettled && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                  <button
                    onClick={(e) => handleDelete(split._id, e)}
                    className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {split.members.map((m) => (
                  <span
                    key={m.name}
                    className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                  >
                    {m.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                <span className="text-[var(--text-secondary)] text-xs">
                  Total: ₹{split.expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString('en-IN')}
                </span>
                <span className={`text-xs font-medium ${split.isSettled ? 'text-green-400' : 'text-primary'}`}>
                  {split.isSettled ? 'Settled ✓' : 'View Details →'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}

export default BillSplits