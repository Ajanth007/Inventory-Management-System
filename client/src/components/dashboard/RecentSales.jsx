import useAsync from '../../hooks/useAsync';
import { getRecentSales } from '../../services/dashboardService';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import Badge, { PAYMENT_TONE, SALE_TONE } from '../common/Badge';
import { AsyncBlock, Section, TableWrap, Td, Th } from '../common/Section';

const cap = (s) => s[0].toUpperCase() + s.slice(1);
export default function RecentSales({ refreshKey }) {
  // BACKEND: Fetch recent sales from GET /api/dashboard/recent-sales
  const { data, loading, error } = useAsync(getRecentSales, [refreshKey]);
  return (
    <Section title="Recent Sales" to="/sales" linkLabel="View All Sales">
      <AsyncBlock loading={loading} error={error} empty={!data?.length} emptyText="No sales yet. Create your first sale to see it here.">
        <TableWrap>
          <thead><tr><Th>Sale</Th><Th>Customer</Th><Th>Date</Th><Th right>Total</Th><Th>Payment</Th><Th>Status</Th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {data?.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <Td className="font-medium">{s.number}</Td><Td>{s.customer}</Td><Td className="whitespace-nowrap text-muted">{formatDate(s.date)}</Td>
                <Td right>{formatCurrency(s.total)}</Td>
                <Td><Badge tone={PAYMENT_TONE[s.paymentStatus]}>{cap(s.paymentStatus)}</Badge></Td>
                <Td><Badge tone={SALE_TONE[s.status]}>{cap(s.status)}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </AsyncBlock>
    </Section>
  );
}
