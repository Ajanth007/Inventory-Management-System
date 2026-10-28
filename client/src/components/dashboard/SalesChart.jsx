import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useAsync from '../../hooks/useAsync';
import { getMonthlySales } from '../../services/dashboardService';
import { formatCurrency } from '../../utils/currency';
import { AsyncBlock, Section } from '../common/Section';

export default function SalesChart({ refreshKey }) {
  // BACKEND: Fetch monthly sales from GET /api/dashboard/monthly-sales
  const { data, loading, error } = useAsync(getMonthlySales, [refreshKey]);
  return (
    <Section title="Monthly Sales" subtitle="Last 6 months">
      <AsyncBlock loading={loading} error={error} empty={!data?.length} emptyText="No sales recorded for this period." height="h-64">
        <div className="h-64" role="img" aria-label="Area chart of monthly sales">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs><linearGradient id="sf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563EB" stopOpacity={0.18} /><stop offset="100%" stopColor="#2563EB" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} width={56} tickFormatter={(v) => formatCurrency(v, { compact: true })} />
              <Tooltip formatter={(v) => [formatCurrency(v), 'Sales']} />
              <Area type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2} fill="url(#sf)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </AsyncBlock>
    </Section>
  );
}
