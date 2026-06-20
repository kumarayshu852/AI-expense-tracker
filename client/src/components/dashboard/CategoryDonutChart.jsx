import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#8B5CF6', '#3B82F6', '#06B6D4', '#EC4899', '#F59E0B', '#10B981', '#6B7280']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-xl">
        <p className="text-[var(--text-primary)] text-sm font-medium">{payload[0].name}</p>
        <p className="text-[var(--text-secondary)] text-xs">₹{payload[0].value.toLocaleString('en-IN')}</p>
      </div>
    )
  }
  return null
}

const CategoryDonutChart = ({ data = [] }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 transition-colors">
      <h3 className="text-[var(--text-primary)] font-semibold mb-4">Top Categories</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="text-[var(--text-secondary)] text-xs">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-[var(--text-secondary)] text-xs">Total</p>
          <p className="text-[var(--text-primary)] font-bold text-lg">₹{total.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  )
}

export default CategoryDonutChart