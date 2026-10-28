import ResourcePage from '../components/common/ResourcePage';
import { StatusBadge } from '../components/common/Badge';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';
export default function Invoices() {
  return <ResourcePage resource="invoices" title="Invoices" subtitle="Track what has been billed and collected" addLabel="New invoice" searchKeys={['number', 'customer']}
    filters={[{ key: 'status', label: 'Status', options: ['pending', 'partial', 'paid', 'overdue'].map((s) => [s, s[0].toUpperCase() + s.slice(1)]), match: (r, v) => r.status === v }]}
    stats={(r) => [{ label: 'Invoices', value: r.length }, { label: 'Billed', value: formatCurrency(r.reduce((s, i) => s + i.total, 0)) },
      { label: 'Outstanding', value: formatCurrency(r.reduce((s, i) => s + i.total - i.paid, 0)) }, { label: 'Overdue', value: r.filter((i) => i.status === 'overdue').length }]}
    columns={[{ key: 'number', label: 'Invoice', className: 'font-medium' }, { key: 'customer', label: 'Customer' }, { key: 'issued', label: 'Issued', render: (r) => formatDate(r.issued) },
      { key: 'due', label: 'Due', render: (r) => formatDate(r.due) }, { key: 'total', label: 'Total', right: true, render: (r) => formatCurrency(r.total) },
      { label: 'Balance', right: true, render: (r) => formatCurrency(r.total - r.paid) }, { label: 'Status', render: (r) => <StatusBadge value={r.status} /> }]}
    fields={[{ key: 'customer', label: 'Customer' }, { key: 'total', label: 'Total', type: 'number' }, { key: 'due', label: 'Due date', type: 'date' }]}
    build={(v, n) => ({ id: Date.now(), number: `INV-${String(332 + n).padStart(4, '0')}`, customer: v.customer, issued: new Date().toISOString(), due: v.due, total: v.total, paid: 0, status: 'pending' })} />;
}
