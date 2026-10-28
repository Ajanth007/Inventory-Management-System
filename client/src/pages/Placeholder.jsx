import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { NAV } from '../components/layout/navConfig';

export default function Placeholder() {
  const { pathname, search } = useLocation();
  const item = NAV.flatMap((g) => g.items).find((i) => i.to === pathname);
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <Construction className="mx-auto h-8 w-8 text-muted" />
        <h1 className="mt-3 text-xl font-semibold">{item?.label || 'Page not found'}</h1>
        <p className="mt-1 text-sm text-muted">{item ? 'This page is a placeholder and has not been built yet.' : 'This route does not exist.'}</p>
        {search && <p className="mt-2 text-xs text-muted">Received filters: <code>{search}</code></p>}
      </div>
    </div>
  );
}
