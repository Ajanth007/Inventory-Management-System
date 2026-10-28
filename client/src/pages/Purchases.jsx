import ResourcePage from '../components/common/ResourcePage';
import { StatusBadge } from '../components/common/Badge';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';
export default function Purchases() {
  // Opens the form prefilled when arriving from the dashboard's Reorder button (?new=1&sku=…&qty=…).
  return <ResourcePage resource="purchases" title="Purchases" subtitle="Orders placed with suppliers" addLabel="New purchase" searchKeys={['number', 'supplier']}
    filters={[{ key: 'status', label: 'Status', options: ['draft', 'ordered', 'received', 'cancelled'].map((s) => [s, s[0].toUpperCase() + s.slice(1)]), match: (r, v) => r.status === v }]}
    stats={(r) => [{ label: 'Purchases', value: r.length }, { label: 'Awaiting delivery', value: r.filter((p) => p.status === 'ordered').length }, { label: 'Total spent', value: formatCurrency(r.filter((p) => p.status === 'received').reduce((s, p) => s + p.total, 0)) }]}
    columns={[{ key: 'number', label: 'Purchase', className: 'font-medium' }, { key: 'supplier', label: 'Supplier' }, { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
      { key: 'total', label: 'Total', right: true, render: (r) => formatCurrency(r.total) }, { label: 'Status', render: (r) => <StatusBadge value={r.status} /> }]}
    fields={[{ key: 'supplier', label: 'Supplier', type: 'select', options: ['TecnoImport SA', 'Accesorios del Sur', 'Global Parts', 'Papelera Andina'] }, { key: 'sku', label: 'Product SKU' },
      { key: 'qty', label: 'Quantity', type: 'number' }, { key: 'unitCost', label: 'Unit cost', type: 'number' }]}
    build={(v, n) => ({ id: Date.now(), number: `P-${String(189 + n).padStart(4, '0')}`, supplier: v.supplier, date: new Date().toISOString(), total: v.qty * v.unitCost, status: 'draft' })} />;
}
