import { Link } from 'react-router-dom';
import { TrendingDown, TrendingUp } from 'lucide-react';

const ICON_TONE = { blue: 'bg-blue-50 text-primary', red: 'bg-red-50 text-critical', amber: 'bg-amber-50 text-amber-600', green: 'bg-green-50 text-ok' };

export default function SummaryCard({ label, value, hint, icon: Icon, tone = 'blue', trend, to, loading }) {
  const body = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <span className={`grid h-8 w-8 place-items-center rounded-lg ${ICON_TONE[tone]}`}><Icon className="h-4 w-4" /></span>
      </div>
      {loading ? <div className="mt-3 h-7 w-24 animate-pulse rounded bg-slate-100" /> : (
        <p className="mt-2 flex items-baseline gap-2 text-2xl font-semibold tabular-nums">
          {value}
          {trend != null && (
            <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trend >= 0 ? 'text-ok' : 'text-critical'}`}>
              {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{Math.abs(trend)}%
            </span>
          )}
        </p>
      )}
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </>
  );
  const cls = 'block rounded-xl border border-slate-200 bg-white p-4 shadow-sm';
  return to ? <Link to={to} className={`${cls} transition-colors hover:border-primary`}>{body}</Link> : <div className={cls}>{body}</div>;
}
