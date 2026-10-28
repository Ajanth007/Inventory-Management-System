import ResourcePage from '../components/common/ResourcePage';
import { StatusBadge } from '../components/common/Badge';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';
const ROLES = ['Administrator', 'Sales', 'Warehouse', 'Accountant'];
export default function Users() {
  return <ResourcePage resource="users" title="Users & Roles" subtitle="Control who can access OPERA and what they can do" addLabel="Invite user" searchKeys={['name', 'email']}
    filters={[{ key: 'role', label: 'Role', options: ROLES.map((r) => [r, r]), match: (r, v) => r.role === v }]}
    columns={[{ key: 'name', label: 'Name', className: 'font-medium' }, { key: 'email', label: 'Email', className: 'text-muted' }, { key: 'role', label: 'Role' },
      { key: 'lastLogin', label: 'Last login', render: (r) => (r.lastLogin ? formatDate(r.lastLogin) : 'Never') }, { label: 'Status', render: (r) => <StatusBadge value={r.status} /> }]}
    fields={[{ key: 'name', label: 'Full name' }, { key: 'email', label: 'Email', type: 'email' }, { key: 'role', label: 'Role', type: 'select', options: ROLES }]}
    build={(v) => ({ id: Date.now(), ...v, status: 'invited', lastLogin: null })} />;
}
