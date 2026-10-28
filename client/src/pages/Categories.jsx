import ResourcePage from '../components/common/ResourcePage';
import { StatusBadge } from '../components/common/Badge';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';
export default function Categories() {
  return <ResourcePage resource="categories" title="Categories" subtitle="Group products to simplify reporting" addLabel="Add category" searchKeys={['name', 'description']}
    filters={[{ key: 'status', label: 'Status', options: [['active', 'Active'], ['inactive', 'Inactive']], match: (r, v) => r.status === v }]}
    columns={[{ key: 'name', label: 'Name', className: 'font-medium' }, { key: 'description', label: 'Description' }, { key: 'products', label: 'Products', right: true }, { label: 'Status', render: (r) => <StatusBadge value={r.status} /> }]}
    fields={[{ key: 'name', label: 'Name' }, { key: 'description', label: 'Description' }]}
    build={(v) => ({ id: Date.now(), ...v, products: 0, status: 'active' })} />;
}
