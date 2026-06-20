import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-xl">
        <p className="text-[var(--text-secondary)] text-xs mb-1">{label}</p>
        <p className="text-[var(--text-primary)] text-sm font-medium">
          ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
      </div>
    )
  }
  return null
}

const ExpenseLineChart = ({ data = [] }) => {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 transition-colors">
      <h3 className="text-[var(--text-primary)] font-semibold mb-4">Expense Overview</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="var(--accent-purple)"
            strokeWidth={2.5}
            dot={{ fill: 'var(--accent-purple)', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ExpenseLineChart