import { ArrowLeftRight, CreditCard, FileText, Package, ShoppingBag, ShoppingCart } from 'lucide-react';
import useAsync from '../../hooks/useAsync';
import { getRecentActivity } from '../../services/dashboardService';
import { formatRelative } from '../../utils/date';
import { AsyncBlock, Section } from '../common/Section';

const ICONS = { sale: ShoppingCart, purchase: ShoppingBag, payment: CreditCard, adjust: ArrowLeftRight, invoice: FileText, product: Package };

export default function RecentActivity({ refreshKey }) {
  // BACKEND: Fetch activity records from GET /api/dashboard/recent-activity
  const { data, loading, error } = useAsync(getRecentActivity, [refreshKey]);
  return (
    <Section title="Recent Activity">
      <AsyncBlock loading={loading} error={error} empty={!data?.length} emptyText="No activity recorded yet." height="h-64">
        <ol className="space-y-4">
          {data?.map((a) => {
            const Icon = ICONS[a.type] || Package;
            return (
              <li key={a.id} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-muted"><Icon className="h-4 w-4" /></span>
                <div className="min-w-0"><p className="text-sm">{a.text}</p><p className="text-xs text-muted">{formatRelative(a.at)}{a.user && ` by ${a.user}`}</p></div>
              </li>
            );
          })}
        </ol>
      </AsyncBlock>
    </Section>
  );
}
