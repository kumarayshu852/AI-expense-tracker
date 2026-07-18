import { useEffect, useState } from 'react'
import { Plus, Loader2, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import GoalCard from '../components/goals/GoalCard'
import GoalForm from '../components/goals/GoalForm'
import { getGoals, createGoal, addToGoal, deleteGoal } from '../services/goalService'

const Goals = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchGoals = async () => {
    try {
      const res = await getGoals()
      setGoals(res.data.data.goals)
    } catch (err) {
      console.error('Failed to fetch goals:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  const handleSubmit = async (formData) => {
    await createGoal(formData)
    fetchGoals()
  }

  const handleAddMoney = async (id, amount) => {
    try {
      await addToGoal(id, amount)
      fetchGoals()
    } catch (err) {
      console.error('Failed to add money:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Do you want to delete this goal?')) return
    try {
      await deleteGoal(id)
      fetchGoals()
    } catch (err) {
      console.error('Failed to delete goal:', err)
    }
  }

  const activeGoals = goals.filter((g) => !g.isCompleted)
  const completedGoals = goals.filter((g) => g.isCompleted)

  const totalTarget = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalSaved = activeGoals.reduce((sum, g) => sum + g.savedAmount, 0)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-[var(--text-primary)] text-xl font-semibold">Saving Goals</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-0.5">
            ₹{totalSaved.toLocaleString('en-IN')} saved of ₹{totalTarget.toLocaleString('en-IN')} total target
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent-cyan text-white text-sm font-medium px-4 py-2.5 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </motion.button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-60">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-10 text-center">
          <Target className="w-10 h-10 text-[var(--text-secondary)] mx-auto mb-3" />
          <p className="text-[var(--text-primary)] font-medium mb-1">There is no cowherd around right now.</p>
          <p className="text-[var(--text-secondary)] text-sm">Set your first savings goal — an emergency fund, a trip, a phone, anything!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeGoals.length > 0 && (
            <div>
              <h3 className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wider mb-3">
                Active Goals ({activeGoals.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal._id}
                    goal={goal}
                    onDelete={handleDelete}
                    onAddMoney={handleAddMoney}
                  />
                ))}
              </div>
            </div>
          )}

          {completedGoals.length > 0 && (
            <div>
              <h3 className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wider mb-3">
                Completed Goals  ({completedGoals.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedGoals.map((goal) => (
                  <GoalCard
                    key={goal._id}
                    goal={goal}
                    onDelete={handleDelete}
                    onAddMoney={handleAddMoney}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <GoalForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default Goals