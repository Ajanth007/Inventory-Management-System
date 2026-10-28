import ResourcePage from '../components/common/ResourcePage';
import { StatusBadge } from '../components/common/Badge';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';
const METHODS = ['cash', 'transfer', 'card'];
export default function Payments() {
  return <ResourcePage resource="payments" title="Payments" subtitle="Money received against invoices" addLabel="Record payment" searchKeys={['ref', 'customer', 'invoice']}
    filters={[{ key: 'method', label: 'Method', options: METHODS.map((m) => [m, m[0].toUpperCase() + m.slice(1)]), match: (r, v) => r.method === v }]}
    stats={(r) => [{ label: 'Payments', value: r.length }, { label: 'Total received', value: formatCurrency(r.reduce((s, p) => s + p.amount, 0)) }]}
    columns={[{ key: 'ref', label: 'Reference', className: 'font-medium' }, { key: 'date', label: 'Date', render: (r) => formatDate(r.date) }, { key: 'customer', label: 'Customer' }, { key: 'invoice', label: 'Invoice' },
      { key: 'method', label: 'Method', className: 'capitalize' }, { key: 'amount', label: 'Amount', right: true, render: (r) => formatCurrency(r.amount) }]}
    fields={[{ key: 'invoice', label: 'Invoice number' }, { key: 'customer', label: 'Customer' }, { key: 'method', label: 'Method', type: 'select', options: METHODS }, { key: 'amount', label: 'Amount', type: 'number' }]}
    build={(v, n) => ({ id: Date.now(), ref: `PAY-${String(208 + n).padStart(4, '0')}`, date: new Date().toISOString(), ...v })} />;
}
