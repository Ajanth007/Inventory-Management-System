import { Menu } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { IS_DEMO } from '../../config';
import Badge from './Badge';

export default function PageHeader({ title, subtitle, actions }) {
  const { openMenu } = useOutletContext();
  return (
    <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-2">
        <button onClick={openMenu} className="mt-0.5 rounded-lg border border-slate-200 bg-white p-2 lg:hidden" aria-label="Open menu"><Menu className="h-4 w-4" /></button>
        <div className="min-w-0">
          <h1 className="flex flex-wrap items-center gap-2 text-xl font-semibold sm:text-2xl">{title} {IS_DEMO && <Badge tone="gray">Demo data</Badge>}</h1>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {actions}
    </header>
  );
}
