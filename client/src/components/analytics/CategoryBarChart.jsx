import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#8B5CF6', '#3B82F6', '#06B6D4', '#EC4899', '#F59E0B', '#10B981', '#6B7280', '#EF4444']

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

const CategoryBarChart = ({ data = [] }) => {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
      <h3 className="text-[var(--text-primary)] font-semibold mb-4">Category-wise Spending</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis type="number" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            stroke="var(--text-secondary)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={110}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border)', opacity: 0.3 }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryBarChart