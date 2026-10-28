import ResourcePage from '../components/common/ResourcePage';
import { StatusBadge } from '../components/common/Badge';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';
const ACTIONS = ['create', 'update', 'delete', 'login_failed'];
export default function AuditLogs() {
  // Read-only: audit entries are written by the backend, never created from the UI.
  return <ResourcePage resource="auditLogs" title="Audit Logs" subtitle="A read-only history of who changed what" searchKeys={['user', 'entity', 'details', 'ip']}
    filters={[{ key: 'action', label: 'Action', options: ACTIONS.map((a) => [a, a.replace('_', ' ')]), match: (r, v) => r.action === v }]}
    columns={[{ key: 'at', label: 'When', render: (r) => new Date(r.at).toLocaleString() }, { key: 'user', label: 'User', className: 'font-medium' },
      { label: 'Action', render: (r) => <StatusBadge value={r.action === 'create' ? 'completed' : r.action === 'login_failed' ? 'failed' : 'ordered'} /> },
      { key: 'entity', label: 'Entity' }, { key: 'details', label: 'Details' }, { key: 'ip', label: 'IP', className: 'text-muted' }]} />;
}
