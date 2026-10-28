import { AlertTriangle, Banknote, Boxes, CalendarDays, Clock, PackageX, ShoppingBag, ShoppingCart } from 'lucide-react';
import useAsync from '../../hooks/useAsync';
import { getDashboardSummary } from '../../services/dashboardService';
import { formatCurrency, formatNumber } from '../../utils/currency';
import SummaryCard from './SummaryCard';
import { AsyncBlock } from '../common/Section';

export default function SummaryGrid({ range, refreshKey }) {
  // BACKEND: Replace demo data with GET /api/dashboard/summary
  const { data: s, loading, error } = useAsync(() => getDashboardSummary(range), [range, refreshKey]);
  if (error) return <AsyncBlock error={error} height="h-28" />;
  const v = (fn) => (s ? fn(s) : '');
  const cards = [
    { label: 'Total Products', icon: Boxes, value: v((x) => formatNumber(x.totalProducts)), hint: 'Active products' },
    { label: 'Total Stock Value', icon: Banknote, tone: 'green', value: v((x) => formatCurrency(x.stockValue, { compact: true })), hint: 'Stock × cost price' },
    { label: "Today's Sales", icon: ShoppingCart, tone: 'green', value: v((x) => formatCurrency(x.todaySales)), hint: v((x) => `${x.todayTransactions} confirmed transactions`) },
    { label: 'Monthly Sales', icon: CalendarDays, value: v((x) => formatCurrency(x.monthlySales, { compact: true })), trend: s?.monthlySalesChange, hint: 'vs. previous month' },
    { label: 'Low-Stock Products', icon: AlertTriangle, tone: 'amber', value: v((x) => formatNumber(x.lowStock)), hint: 'At or below minimum stock', to: '/products?stock=low' },
    { label: 'Out-of-Stock Products', icon: PackageX, tone: 'red', value: v((x) => formatNumber(x.outOfStock)), hint: 'Zero units available', to: '/inventory?stock=out' },
    { label: 'Pending Payments', icon: Clock, tone: 'amber', value: v((x) => formatCurrency(x.pendingPayments, { compact: true })), hint: v((x) => `${x.pendingInvoices} open invoices`) },
    { label: "Today's Purchases", icon: ShoppingBag, value: v((x) => formatCurrency(x.todayPurchases)), hint: 'Recorded today' },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => <SummaryCard key={c.label} loading={loading} {...c} />)}
    </div>
  );
}
