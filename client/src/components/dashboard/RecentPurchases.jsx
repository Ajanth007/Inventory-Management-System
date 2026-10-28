import useAsync from '../../hooks/useAsync';
import { getRecentPurchases } from '../../services/dashboardService';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import Badge, { PURCHASE_TONE } from '../common/Badge';
import { AsyncBlock, Section, TableWrap, Td, Th } from '../common/Section';

export default function RecentPurchases({ refreshKey }) {
  // BACKEND: Fetch recent purchases from GET /api/dashboard/recent-purchases
  const { data, loading, error } = useAsync(getRecentPurchases, [refreshKey]);
  return (
    <Section title="Recent Purchases" to="/purchases" linkLabel="View All Purchases">
      <AsyncBlock loading={loading} error={error} empty={!data?.length} emptyText="No purchases yet.">
        <TableWrap>
          <thead><tr><Th>Purchase</Th><Th>Supplier</Th><Th>Date</Th><Th right>Total</Th><Th>Status</Th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {data?.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <Td className="font-medium">{p.number}</Td><Td>{p.supplier}</Td><Td className="whitespace-nowrap text-muted">{formatDate(p.date)}</Td>
                <Td right>{formatCurrency(p.total)}</Td>
                <Td><Badge tone={PURCHASE_TONE[p.status]}>{p.status[0].toUpperCase() + p.status.slice(1)}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </AsyncBlock>
    </Section>
  );
}
