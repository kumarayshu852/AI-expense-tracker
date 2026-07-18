import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { CATEGORIES } from '../../utils/constants'

const FilterBar = ({ onFilter, categories = [] }) => {
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const allCategories = [
    ...CATEGORIES,
    ...categories.filter((c) => !c.isDefault).map((c) => c.name),
  ]

  const handleApply = () => {
    onFilter({ type, category, startDate, endDate })
    setIsOpen(false)
  }

  const handleReset = () => {
    setType('all')
    setCategory('all')
    setStartDate('')
    setEndDate('')
    onFilter({ type: 'all', category: 'all', startDate: '', endDate: '' })
    setIsOpen(false)
  }

  const isFiltered = type !== 'all' || category !== 'all' || startDate || endDate

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 text-sm px-3 py-2.5 rounded-lg border transition ${
          isFiltered
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        <Filter className="w-4 h-4" />
        Filter
        {isFiltered && (
          <span className="w-2 h-2 rounded-full bg-primary ml-0.5" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 z-20 w-72 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-primary)] text-sm font-medium">Filters</span>
            <button onClick={() => setIsOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Type filter */}
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Type</label>
            <div className="flex gap-2">
              {['all', 'expense', 'income'].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                    type === t
                      ? 'bg-primary text-white'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-primary"
            >
              <option value="all">All Categories</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Date range */}
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Date Range</label>
            <div className="space-y-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-primary"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleReset}
              className="flex-1 py-2 text-xs text-[var(--text-secondary)] border border-[var(--border)] rounded-lg hover:text-[var(--text-primary)] transition"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-2 text-xs text-white bg-gradient-to-r from-primary to-accent-cyan rounded-lg"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterBar