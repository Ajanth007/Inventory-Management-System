import ResourcePage from '../components/common/ResourcePage';
import { StatusBadge } from '../components/common/Badge';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';
export default function Sales() {
  return <ResourcePage resource="sales" title="Sales & Orders" subtitle="Orders from quote to completed sale" addLabel="New sale" searchKeys={['number', 'customer']}
    filters={[{ key: 'status', label: 'Status', options: ['confirmed', 'completed', 'cancelled'].map((s) => [s, s[0].toUpperCase() + s.slice(1)]), match: (r, v) => r.status === v },
      { key: 'payment', label: 'Payment', options: ['paid', 'partial', 'pending'].map((s) => [s, s[0].toUpperCase() + s.slice(1)]), match: (r, v) => r.paymentStatus === v }]}
    stats={(r) => { const ok = r.filter((s) => s.status !== 'cancelled'); return [{ label: 'Orders', value: r.length }, { label: 'Confirmed revenue', value: formatCurrency(ok.reduce((s, x) => s + x.total, 0)) },
      { label: 'Unpaid orders', value: ok.filter((s) => s.paymentStatus !== 'paid').length }]; }}
    columns={[{ key: 'number', label: 'Sale', className: 'font-medium' }, { key: 'customer', label: 'Customer' }, { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
      { key: 'total', label: 'Total', right: true, render: (r) => formatCurrency(r.total) }, { label: 'Payment', render: (r) => <StatusBadge value={r.paymentStatus} /> }, { label: 'Status', render: (r) => <StatusBadge value={r.status} /> }]}
    fields={[{ key: 'customer', label: 'Customer', type: 'select', options: ['Distribuidora Andina', 'Tienda La Esquina', 'Papelería Central', 'Ferretería Norte', 'Café Mirador'] }, { key: 'total', label: 'Total', type: 'number' }]}
    build={(v, n) => ({ id: Date.now(), number: `S-${String(413 + n).padStart(4, '0')}`, ...v, date: new Date().toISOString(), paymentStatus: 'pending', status: 'confirmed' })} />;
}
