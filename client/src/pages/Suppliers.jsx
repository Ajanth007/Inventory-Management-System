import ResourcePage from '../components/common/ResourcePage';
import { StatusBadge } from '../components/common/Badge';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';
export default function Suppliers() {
  return <ResourcePage resource="suppliers" title="Suppliers" subtitle="Vendors you buy inventory from" addLabel="Add supplier" searchKeys={['name', 'contact', 'email', 'country']}
    filters={[{ key: 'status', label: 'Status', options: [['active', 'Active'], ['inactive', 'Inactive']], match: (r, v) => r.status === v }]}
    stats={(r) => [{ label: 'Suppliers', value: r.length }, { label: 'Active', value: r.filter((s) => s.status === 'active').length }, { label: 'Owed to suppliers', value: formatCurrency(r.reduce((s, x) => s + x.balance, 0)) }]}
    columns={[{ key: 'name', label: 'Supplier', className: 'font-medium' }, { key: 'contact', label: 'Contact' }, { key: 'email', label: 'Email', className: 'text-muted' }, { key: 'phone', label: 'Phone' },
      { key: 'country', label: 'Country' }, { key: 'balance', label: 'Balance', right: true, render: (r) => formatCurrency(r.balance) }, { label: 'Status', render: (r) => <StatusBadge value={r.status} /> }]}
    fields={[{ key: 'name', label: 'Company name' }, { key: 'contact', label: 'Contact person' }, { key: 'email', label: 'Email', type: 'email' }, { key: 'phone', label: 'Phone' }, { key: 'country', label: 'Country' }]}
    build={(v) => ({ id: Date.now(), ...v, balance: 0, status: 'active' })} />;
}
