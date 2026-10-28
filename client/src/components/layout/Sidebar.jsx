import { NavLink } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { NAV } from './navConfig';
import { getCurrentUser, logout } from '../../services/authService';

export default function Sidebar({ open, onClose }) {
  const user = getCurrentUser();
  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-14 shrink-0 items-center justify-between px-4">
          <span className="text-lg font-bold tracking-tight text-primary">OPERA <span className="text-xs font-medium text-muted">ERP MiPyme</span></span>
          <button onClick={onClose} className="rounded p-1 text-muted hover:bg-slate-100 lg:hidden" aria-label="Close menu"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {NAV.map((g) => (
            <div key={g.group} className="mt-4 first:mt-1">
              <p className="px-2 pb-1 text-xs font-medium text-muted">{g.group}</p>
              <ul className="space-y-0.5">
                {g.items.map(({ label, to, icon: Icon }) => (
                  <li key={to}>
                    <NavLink to={to} end={to === '/'} onClick={onClose}
                      className={({ isActive }) => `flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors ${isActive ? 'bg-blue-50 font-medium text-primary' : 'text-slate-600 hover:bg-slate-100'}`}>
                      <Icon className="h-4 w-4 shrink-0" /><span className="truncate">{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3 border-t border-slate-200 p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-white">{initials}</span>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{user.name}</p><p className="truncate text-xs text-muted">{user.role}</p></div>
          <button onClick={logout} className="rounded p-2 text-muted hover:bg-slate-100 hover:text-ink" aria-label="Log out" title="Log out (placeholder)"><LogOut className="h-4 w-4" /></button>
        </div>
      </aside>
    </>
  );
}
