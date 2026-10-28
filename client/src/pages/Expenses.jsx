import ResourcePage from '../components/common/ResourcePage';
import { StatusBadge } from '../components/common/Badge';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';
const CATS = ['Rent', 'Utilities', 'Payroll', 'Logistics', 'Marketing', 'Other'];
export default function Expenses() {
  return <ResourcePage resource="expenses" title="Expenses" subtitle="Operating costs outside of inventory purchases" addLabel="Add expense" searchKeys={['description', 'vendor', 'category']}
    filters={[{ key: 'category', label: 'Category', options: CATS.map((c) => [c, c]), match: (r, v) => r.category === v }]}
    stats={(r) => [{ label: 'Expenses', value: r.length }, { label: 'Total', value: formatCurrency(r.reduce((s, e) => s + e.amount, 0)) }, { label: 'Pending', value: formatCurrency(r.filter((e) => e.status === 'pending').reduce((s, e) => s + e.amount, 0)) }]}
    columns={[{ key: 'date', label: 'Date', render: (r) => formatDate(r.date) }, { key: 'category', label: 'Category' }, { key: 'description', label: 'Description', className: 'font-medium' }, { key: 'vendor', label: 'Vendor' },
      { key: 'amount', label: 'Amount', right: true, render: (r) => formatCurrency(r.amount) }, { label: 'Status', render: (r) => <StatusBadge value={r.status} /> }]}
    fields={[{ key: 'category', label: 'Category', type: 'select', options: CATS }, { key: 'description', label: 'Description' }, { key: 'vendor', label: 'Vendor' }, { key: 'amount', label: 'Amount', type: 'number' }]}
    build={(v) => ({ id: Date.now(), date: new Date().toISOString(), ...v, status: 'pending' })} />;
}
