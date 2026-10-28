import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useAsync from '../../hooks/useAsync';
import { getPurchaseVsSales } from '../../services/dashboardService';
import { formatCurrency } from '../../utils/currency';
import { AsyncBlock, Section } from '../common/Section';

export default function PurchaseSalesChart({ refreshKey }) {
  // BACKEND: Fetch purchase vs. sales data from GET /api/dashboard/purchase-vs-sales
  const { data, loading, error } = useAsync(getPurchaseVsSales, [refreshKey]);
  return (
    <Section title="Purchases vs. Sales" subtitle="Last 6 months">
      <AsyncBlock loading={loading} error={error} empty={!data?.length} emptyText="No purchase or sales data yet." height="h-64">
        <div className="h-64" role="img" aria-label="Bar chart comparing monthly purchases and sales">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} width={56} tickFormatter={(v) => formatCurrency(v, { compact: true })} />
              <Tooltip formatter={(v, n) => [formatCurrency(v), n]} cursor={{ fill: '#F1F5F9' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="sales" name="Sales" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="purchases" name="Purchases" fill="#94A3B8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </AsyncBlock>
    </Section>
  );
}
