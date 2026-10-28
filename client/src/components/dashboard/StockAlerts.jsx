import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAsync from '../../hooks/useAsync';
import { getStockAlerts } from '../../services/dashboardService';
import { getStockStatus, STATUS_META, suggestedReorder } from '../../utils/stock';
import { formatNumber } from '../../utils/currency';
import Badge from '../common/Badge';
import { AsyncBlock, Section, TableWrap, Td, Th } from '../common/Section';

const TABS = [['all', 'All Alerts'], ['critical', 'Critical'], ['low', 'Low Stock'], ['out_of_stock', 'Out of Stock']];
const BAR = { red: 'bg-critical', amber: 'bg-low', green: 'bg-ok' };

export default function StockAlerts({ refreshKey, search }) {
  const [tab, setTab] = useState('all');
  const navigate = useNavigate();
  // BACKEND: Fetch stock alerts from GET /api/dashboard/stock-alerts
  const { data, loading, error } = useAsync(getStockAlerts, [refreshKey]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data || [])
      .map((p) => ({ ...p, status: getStockStatus(p.available, p.minStock), reorder: suggestedReorder(p) }))
      .filter((p) => p.status !== 'in_stock')                       // only products needing attention
      .filter((p) => tab === 'all' || p.status === tab)
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
      .sort((a, b) => STATUS_META[a.status].rank - STATUS_META[b.status].rank || a.available - b.available);
  }, [data, tab, search]);

  // BACKEND: Implement the stock reorder action using the purchase creation API (POST /api/purchases).
  // Placeholder: navigates to /purchases with the product preselected in the query string.
  const reorder = (p) => navigate(`/purchases?new=1&productId=${p.id}&sku=${encodeURIComponent(p.sku)}&qty=${p.reorder}`);

  return (
    <Section title="Stock Alerts" subtitle="Products nearing exhaustion, most urgent first" to="/products" linkLabel="View All Products"
      actions={
        <div role="tablist" aria-label="Filter alerts" className="flex rounded-lg bg-slate-100 p-0.5">
          {TABS.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
              className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ${tab === k ? 'bg-white shadow-sm' : 'text-muted'}`}>{l}</button>
          ))}
        </div>}>
      <AsyncBlock loading={loading} error={error} empty={!rows.length} emptyText="No products need attention in this view." height="h-48">
        <TableWrap>
          <thead><tr><Th>Product</Th><Th>SKU</Th><Th right>Available</Th><Th right>Minimum</Th><Th>Level</Th><Th>Status</Th><Th right>Reorder qty</Th><Th>Action</Th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((p) => {
              const m = STATUS_META[p.status];
              const pct = Math.min(100, Math.round((p.available / p.minStock) * 100));
              return (
                <tr key={p.id} className="hover:bg-slate-50">
                  <Td className="font-medium">{p.name}</Td>
                  <Td className="text-muted">{p.sku}</Td>
                  <Td right className="font-semibold">{formatNumber(p.available)}</Td>
                  <Td right className="text-muted">{formatNumber(p.minStock)}</Td>
                  <Td><div className="h-1.5 w-20 rounded-full bg-slate-100" role="img" aria-label={`${pct}% of minimum stock`}><div className={`h-full rounded-full ${BAR[m.tone]}`} style={{ width: `${Math.max(pct, 4)}%` }} /></div></Td>
                  <Td><Badge tone={m.tone}>{m.label}</Badge></Td>
                  <Td right>{formatNumber(p.reorder)}</Td>
                  <Td><button onClick={() => reorder(p)} className="rounded-md border border-primary px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary hover:text-white">Reorder</button></Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
        <p className="mt-3 text-xs text-muted">Suggested reorder = max(0, target stock − available). Target stock is separate from the minimum; products without one use a demo default of 3× minimum.</p>
      </AsyncBlock>
    </Section>
  );
}
