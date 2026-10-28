import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Banknote, Clock, Download, Receipt, TrendingUp } from 'lucide-react';
import useAsync from '../hooks/useAsync';
import { getAccounting } from '../services/moduleService';
import { formatCurrency } from '../utils/currency';
import PageHeader from '../components/common/PageHeader';
import SummaryCard from '../components/dashboard/SummaryCard';
import { AsyncBlock, Section } from '../components/common/Section';

export default function Accounting() {
  // BACKEND: GET /api/accounting/overview — see src/services/moduleService.js
  const { data, loading, error } = useAsync(getAccounting, []);
  const k = data?.kpis;
  return (
    <>
      <PageHeader title="Accounting & Reports" subtitle="Profitability and financial statements" />
      {error ? <AsyncBlock error={error} /> : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard loading={loading} label="Revenue" icon={Banknote} tone="green" value={k && formatCurrency(k.revenue, { compact: true })} hint="This month" />
            <SummaryCard loading={loading} label="Expenses" icon={Receipt} tone="amber" value={k && formatCurrency(k.expenses, { compact: true })} hint="Purchases and operating costs" />
            <SummaryCard loading={loading} label="Net profit" icon={TrendingUp} value={k && formatCurrency(k.netProfit, { compact: true })} hint="Revenue − expenses" />
            <SummaryCard loading={loading} label="Receivables" icon={Clock} tone="red" value={k && formatCurrency(k.receivables, { compact: true })} hint="Unpaid customer invoices" />
          </div>
          <Section title="Revenue vs. Expenses" subtitle="Last 6 months">
            <AsyncBlock loading={loading} empty={!data?.monthly?.length} emptyText="No financial data yet." height="h-64">
              <div className="h-64" role="img" aria-label="Bar chart of monthly revenue and expenses">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.monthly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} width={56} tickFormatter={(v) => formatCurrency(v, { compact: true })} />
                    <Tooltip formatter={(v, n) => [formatCurrency(v), n]} cursor={{ fill: '#F1F5F9' }} /><Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="revenue" name="Revenue" fill="#16A34A" radius={[4, 4, 0, 0]} /><Bar dataKey="expenses" name="Expenses" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AsyncBlock>
          </Section>
          <Section title="Reports">
            <AsyncBlock loading={loading} empty={!data?.reports?.length} emptyText="No reports available.">
              <ul className="divide-y divide-slate-100">
                {data?.reports.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0"><p className="text-sm font-medium">{r.name}</p><p className="text-xs text-muted">{r.description}</p></div>
                    {/* BACKEND: Implement report export via GET /api/accounting/reports/:id?format=pdf */}
                    <button disabled title="Placeholder — export is not connected yet" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-muted opacity-60"><Download className="h-3.5 w-3.5" />Export</button>
                  </li>))}
              </ul>
            </AsyncBlock>
          </Section>
        </div>)}
    </>
  );
}
