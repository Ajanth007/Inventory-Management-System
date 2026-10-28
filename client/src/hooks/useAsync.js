import { useCallback, useEffect, useState } from 'react';
// Runs `fetcher` on mount and whenever deps change. Errors never crash the page.
export default function useAsync(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const run = useCallback(() => {
    let live = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetcher()
      .then((data) => live && setState({ data, loading: false, error: null }))
      .catch((e) => live && setState({ data: null, loading: false, error: e.message || 'Request failed' }));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(run, [run]);
  return { ...state };
}
