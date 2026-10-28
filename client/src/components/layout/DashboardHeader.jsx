import { useState } from 'react';
import { Bell, ChevronDown, Menu, RefreshCw, Search } from 'lucide-react';
import { getCurrentUser, logout } from '../../services/authService';
import { IS_DEMO } from '../../config';

export const RANGES = [
  { value: 'today', label: 'Today' }, { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' }, { value: 'month', label: 'This Month' },
];
const DEMO_NOTES = ['USB Cable is out of stock', 'Wireless Mouse is critically low', 'Invoice INV-0331 is overdue'];

export default function DashboardHeader({ onMenu, search, onSearch, range, onRange, onRefresh, refreshing }) {
  const [menu, setMenu] = useState(null); // 'bell' | 'user' | null
  const user = getCurrentUser();
  const toggle = (k) => setMenu((m) => (m === k ? null : k));
  const pop = 'absolute right-0 top-11 z-20 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg';
  return (
    <header className="mb-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <button onClick={onMenu} className="mt-0.5 rounded-lg border border-slate-200 bg-white p-2 lg:hidden" aria-label="Open menu"><Menu className="h-4 w-4" /></button>
          <div className="min-w-0"><h1 className="text-xl font-semibold sm:text-2xl">Dashboard</h1><p className="text-sm text-muted">Overview of your business performance</p></div>
        </div>
        <div className="relative flex shrink-0 items-center gap-1.5">
          <button onClick={onRefresh} className="rounded-lg border border-slate-200 bg-white p-2 text-muted hover:text-ink" aria-label="Refresh dashboard data" title="Refresh">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => toggle('bell')} className="relative rounded-lg border border-slate-200 bg-white p-2 text-muted hover:text-ink" aria-label="Notifications, 3 unread" aria-expanded={menu === 'bell'}>
            <Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-critical ring-2 ring-white" />
          </button>
          <button onClick={() => toggle('user')} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white py-1.5 pl-1.5 pr-2" aria-label="Profile menu" aria-expanded={menu === 'user'}>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] font-semibold text-white">{user.name[0]}</span><ChevronDown className="h-3.5 w-3.5 text-muted" />
          </button>
          {menu === 'bell' && (
            <div className={pop} role="menu">
              <p className="px-2 py-1 text-xs text-muted">{IS_DEMO ? 'Demo notifications — placeholder' : 'Notifications'}{/* BACKEND: Fetch notifications from GET /api/notifications */}</p>
              {DEMO_NOTES.map((n) => <p key={n} className="rounded-lg px-2 py-2 text-sm hover:bg-slate-50">{n}</p>)}
            </div>
          )}
          {menu === 'user' && (
            <div className={pop} role="menu">
              <div className="px-2 py-1.5"><p className="text-sm font-medium">{user.name}</p><p className="truncate text-xs text-muted">{user.email}</p></div>
              <button onClick={logout} className="w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50" role="menuitem">Log out (placeholder)</button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-sm">
          <span className="sr-only">Search products by name or SKU</span>
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted" />
          <input type="search" value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search stock alerts by name or SKU"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400" />
          {/* BACKEND: Global search is a placeholder — it only filters stock alerts. Connect to GET /api/search?q= */}
        </label>
        <div role="group" aria-label="Date range" className="inline-flex w-full rounded-lg border border-slate-200 bg-white p-0.5 sm:w-auto">
          {RANGES.map((r) => (
            <button key={r.value} onClick={() => onRange(r.value)} aria-pressed={range === r.value}
              className={`flex-1 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:flex-none ${range === r.value ? 'bg-primary text-white' : 'text-muted hover:text-ink'}`}>{r.label}</button>
          ))}
        </div>
      </div>
    </header>
  );
}
