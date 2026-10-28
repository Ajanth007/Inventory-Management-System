import ResourcePage from '../components/common/ResourcePage';
import { StatusBadge } from '../components/common/Badge';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';
export default function Customers() {
  return <ResourcePage resource="customers" title="Customers" subtitle="Who you sell to and what they owe" addLabel="Add customer" searchKeys={['name', 'email', 'city']}
    filters={[{ key: 'status', label: 'Status', options: [['active', 'Active'], ['inactive', 'Inactive']], match: (r, v) => r.status === v }]}
    stats={(r) => [{ label: 'Customers', value: r.length }, { label: 'Active', value: r.filter((c) => c.status === 'active').length }, { label: 'Outstanding balance', value: formatCurrency(r.reduce((s, c) => s + c.balance, 0)) }]}
    columns={[{ key: 'name', label: 'Customer', className: 'font-medium' }, { key: 'email', label: 'Email', className: 'text-muted' }, { key: 'phone', label: 'Phone' }, { key: 'city', label: 'City' },
      { key: 'balance', label: 'Balance', right: true, render: (r) => formatCurrency(r.balance) }, { label: 'Status', render: (r) => <StatusBadge value={r.status} /> }]}
    fields={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email', type: 'email' }, { key: 'phone', label: 'Phone' }, { key: 'city', label: 'City' }]}
    build={(v) => ({ id: Date.now(), ...v, balance: 0, status: 'active' })} />;
}
