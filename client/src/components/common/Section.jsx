import { Link } from 'react-router-dom';
import { AlertTriangle, Inbox, RotateCw } from 'lucide-react';
import { IS_DEMO } from '../../config';
import Badge from './Badge';

// Card wrapper with title, optional link/actions, and a "Demo data" marker.
export function Section({ title, subtitle, to, linkLabel, actions, children, className = '' }) {
  return (
    <section className={`min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-sm font-semibold">{title} {IS_DEMO && <Badge tone="gray">Demo data</Badge>}</h2>
          {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {actions}
          {to && <Link to={to} className="text-xs font-medium text-primary hover:underline">{linkLabel}</Link>}
        </div>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

// Handles loading / error / empty states for any async block.
export function AsyncBlock({ loading, error, empty, emptyText = 'Nothing to show yet.', onRetry, height = 'h-40', children }) {
  if (loading) return <div className={`${height} animate-pulse rounded-lg bg-slate-100`} role="status" aria-label="Loading" />;
  if (error) return (
    <div className={`${height} flex flex-col items-center justify-center gap-2 text-center`} role="alert">
      <AlertTriangle className="h-5 w-5 text-critical" />
      <p className="text-sm text-muted">Could not load this section: {error}</p>
      {onRetry && <button onClick={onRetry} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"><RotateCw className="h-3 w-3" />Try again</button>}
    </div>
  );
  if (empty) return (
    <div className={`${height} flex flex-col items-center justify-center gap-2 text-center text-muted`}>
      <Inbox className="h-5 w-5" /><p className="text-sm">{emptyText}</p>
    </div>
  );
  return children;
}

export const Th = ({ children, right }) => <th scope="col" className={`px-3 py-2 text-xs font-medium text-muted ${right ? 'text-right' : 'text-left'}`}>{children}</th>;
export const Td = ({ children, right, className = '' }) => <td className={`px-3 py-2.5 text-sm ${right ? 'text-right tabular-nums' : ''} ${className}`}>{children}</td>;
// Tables scroll inside their own container so the page never overflows horizontally.
export const TableWrap = ({ children }) => <div className="-mx-4 overflow-x-auto px-4"><table className="w-full min-w-[480px] divide-y divide-slate-100">{children}</table></div>;
