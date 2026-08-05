import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { AppCard } from '../common/AppCard'
import { EmptyState } from '../common/EmptyState'

const CHART_COLORS = ['#8b5cf6', '#ec4899', '#22d3ee', '#34d399', '#fb923c', '#facc15']

interface ScoreDistributionProps {
  data: { range: string; count: number }[]
}

export function ScoreDistributionChart({ data }: ScoreDistributionProps) {
  const hasData = data.some((d) => d.count > 0)
  return (
    <AppCard>
      <h3 className="mb-4 font-bold font-display">Score distribution</h3>
      {!hasData ? (
        <EmptyState title="No data yet" description="Score distribution appears once friends respond." />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-white/5" />
            <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-400" />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-400" />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
            />
            <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </AppCard>
  )
}

interface ResponsesOverTimeProps {
  data: { date: string; responses: number }[]
}

export function ResponsesOverTimeChart({ data }: ResponsesOverTimeProps) {
  const hasData = data.length > 0
  return (
    <AppCard>
      <h3 className="mb-4 font-bold font-display">Responses over time</h3>
      {!hasData ? (
        <EmptyState title="No activity yet" description="Response trends will show up once your quiz is live." />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-white/5" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-400" />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-400" />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }} />
            <Line type="monotone" dataKey="responses" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </AppCard>
  )
}

interface CategoryPerformanceProps {
  data: { category: string; accuracy: number }[]
}

export function CategoryPerformanceChart({ data }: CategoryPerformanceProps) {
  const hasData = data.length > 0
  return (
    <AppCard>
      <h3 className="mb-4 font-bold font-display">Category performance</h3>
      {!hasData ? (
        <EmptyState title="No data yet" description="Category accuracy appears once responses come in." />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={data} dataKey="accuracy" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </AppCard>
  )
}
