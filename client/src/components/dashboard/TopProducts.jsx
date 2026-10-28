import useAsync from '../../hooks/useAsync';
import { getTopProducts } from '../../services/dashboardService';
import { formatCurrency, formatNumber } from '../../utils/currency';
import { AsyncBlock, Section, TableWrap, Td, Th } from '../common/Section';

export default function TopProducts({ range, refreshKey }) {
  // BACKEND: Fetch top-selling products from GET /api/dashboard/top-products
  const { data, loading, error } = useAsync(() => getTopProducts(range), [range, refreshKey]);
  return (
    <Section title="Top-Selling Products" subtitle="Ranked by revenue">
      <AsyncBlock loading={loading} error={error} empty={!data?.length} emptyText="No sales in this range.">
        <TableWrap>
          <thead><tr><Th>Product</Th><Th>SKU</Th><Th right>Units</Th><Th right>Revenue</Th><Th right>Stock</Th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {[...data || []].sort((a, b) => b.revenue - a.revenue).map((p, i) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <Td className="font-medium"><span className="mr-2 text-muted">{i + 1}.</span>{p.name}</Td>
                <Td className="text-muted">{p.sku}</Td><Td right>{formatNumber(p.unitsSold)}</Td>
                <Td right>{formatCurrency(p.revenue)}</Td>
                <Td right className={p.stock === 0 ? 'font-semibold text-critical' : ''}>{formatNumber(p.stock)}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </AsyncBlock>
    </Section>
  );
}
