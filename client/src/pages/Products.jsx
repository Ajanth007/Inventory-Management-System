import ResourcePage from '../components/common/ResourcePage';
import { StatusBadge } from '../components/common/Badge';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';
import { getStockStatus, STATUS_META } from '../utils/stock';
import Badge from '../components/common/Badge';

export const stockBadge = (r) => { const m = STATUS_META[getStockStatus(r.stock, r.minStock)]; return <Badge tone={m.tone}>{m.label}</Badge>; };
// Matches the dashboard cards: "low" = above zero and at/below minimum, "out" = zero.
export const STOCK_FILTER = { key: 'stock', label: 'Stock', options: [['low', 'Low stock'], ['out', 'Out of stock'], ['in', 'In stock']],
  match: (r, v) => (v === 'out' ? r.stock === 0 : v === 'low' ? r.stock > 0 && r.stock <= r.minStock : r.stock > r.minStock) };

export default function Products() {
  return <ResourcePage resource="products" title="Products" subtitle="Manage your catalog, prices and stock thresholds" addLabel="Add product"
    searchKeys={['name', 'sku', 'category']} filters={[STOCK_FILTER, { key: 'category', label: 'Category', options: ['Electronics', 'Accessories', 'Office', 'Home'].map((c) => [c, c]), match: (r, v) => r.category === v }]}
    stats={(r) => [{ label: 'Products', value: formatNumber(r.length) }, { label: 'Stock value', value: formatCurrency(r.reduce((s, p) => s + p.stock * p.cost, 0)) },
      { label: 'Low stock', value: r.filter((p) => p.stock > 0 && p.stock <= p.minStock).length }, { label: 'Out of stock', value: r.filter((p) => p.stock === 0).length }]}
    columns={[{ key: 'name', label: 'Product', className: 'font-medium' }, { key: 'sku', label: 'SKU', className: 'text-muted' }, { key: 'category', label: 'Category' },
      { key: 'cost', label: 'Cost', right: true, render: (r) => formatCurrency(r.cost) }, { key: 'price', label: 'Price', right: true, render: (r) => formatCurrency(r.price) },
      { key: 'stock', label: 'Stock', right: true, render: (r) => formatNumber(r.stock) }, { label: 'Status', render: stockBadge }]}
    fields={[{ key: 'name', label: 'Name' }, { key: 'sku', label: 'SKU' }, { key: 'category', label: 'Category', type: 'select', options: ['Electronics', 'Accessories', 'Office', 'Home'] },
      { key: 'cost', label: 'Cost price', type: 'number' }, { key: 'price', label: 'Sale price', type: 'number' }, { key: 'stock', label: 'Initial stock', type: 'number' }, { key: 'minStock', label: 'Minimum stock', type: 'number', default: 10 }]} />;
}
