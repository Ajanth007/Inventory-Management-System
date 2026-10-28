import ResourcePage from '../components/common/ResourcePage';
import { StatusBadge } from '../components/common/Badge';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';
import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { STOCK_FILTER, stockBadge } from './Products';

const TABS = [['levels', 'Stock levels'], ['movements', 'Movements']];
const MOVE = ['in', 'out', 'adjustment'];
export default function Inventory() {
  const [tab, setTab] = useState('levels');
  return (
    <>
      <PageHeader title="Inventory" subtitle="Current stock levels and every movement in and out" />
      <div role="tablist" className="mb-4 inline-flex rounded-lg bg-slate-100 p-0.5">
        {TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-md px-3 py-1.5 text-sm font-medium ${tab === k ? 'bg-white shadow-sm' : 'text-muted'}`}>{l}</button>)}
      </div>
      {tab === 'levels' ? (
        <ResourcePage key="levels" embedded resource="products" title="Stock levels" searchKeys={['name', 'sku']} filters={[STOCK_FILTER]}
          columns={[{ key: 'name', label: 'Product', className: 'font-medium' }, { key: 'sku', label: 'SKU', className: 'text-muted' }, { key: 'stock', label: 'Available', right: true },
            { key: 'minStock', label: 'Minimum', right: true }, { label: 'Value', right: true, render: (r) => formatCurrency(r.stock * r.cost) }, { label: 'Status', render: stockBadge }]} />
      ) : (
        <ResourcePage key="movements" embedded resource="movements" title="Movements" addLabel="Record movement" searchKeys={['product', 'sku', 'reference']}
          filters={[{ key: 'type', label: 'Type', options: MOVE.map((t) => [t, t[0].toUpperCase() + t.slice(1)]), match: (r, v) => r.type === v }]}
          columns={[{ key: 'date', label: 'Date', render: (r) => formatDate(r.date) }, { key: 'product', label: 'Product', className: 'font-medium' }, { key: 'sku', label: 'SKU', className: 'text-muted' },
            { label: 'Type', render: (r) => <StatusBadge value={r.type} /> }, { key: 'qty', label: 'Qty', right: true, render: (r) => <span className={r.qty < 0 ? 'text-critical' : 'text-ok'}>{r.qty > 0 ? '+' : ''}{r.qty}</span> },
            { key: 'reference', label: 'Reference' }, { key: 'user', label: 'User' }]}
          fields={[{ key: 'sku', label: 'SKU' }, { key: 'type', label: 'Type', type: 'select', options: MOVE }, { key: 'qty', label: 'Quantity (use − for removals)', type: 'number' }, { key: 'reference', label: 'Reference / note' }]}
          build={(v) => ({ id: Date.now(), date: new Date().toISOString(), product: v.sku, ...v, user: 'You' })} />
      )}
    </>
  );
}
