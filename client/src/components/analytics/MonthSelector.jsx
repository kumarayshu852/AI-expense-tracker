import { ChevronLeft, ChevronRight } from 'lucide-react'

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MonthSelector = ({ month, year, onChange }) => {
  const goToPrevMonth = () => {
    if (month === 1) {
      onChange(12, year - 1)
    } else {
      onChange(month - 1, year)
    }
  }

  const goToNextMonth = () => {
    if (month === 12) {
      onChange(1, year + 1)
    } else {
      onChange(month + 1, year)
    }
  }

  return (
    <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2">
      <button
        onClick={goToPrevMonth}
        className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]/40 transition"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <span className="text-[var(--text-primary)] text-sm font-medium min-w-[110px] text-center">
        {monthNames[month - 1]} {year}
      </span>

      <button
        onClick={goToNextMonth}
        className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]/40 transition"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export default MonthSelector