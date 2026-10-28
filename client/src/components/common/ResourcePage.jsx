import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Plus, Search, X } from 'lucide-react';
import useAsync from '../../hooks/useAsync';
import { createResource, listResource } from '../../services/moduleService';
import { AsyncBlock, TableWrap, Td } from './Section';
import PageHeader from './PageHeader';

const input = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm';

// Generic list page: stats strip, search, filters, sortable columns, pagination, and an "add" form.
// Config-driven so every module page stays small. Filters/fields read their initial values from the URL
// (e.g. /products?stock=low, /purchases?new=1&sku=ACC-001&qty=40 from the dashboard's Reorder button).
export default function ResourcePage({ resource, title, subtitle, columns, filters = [], fields, build, stats, searchKeys = [], addLabel, pageSize = 8, embedded = false }) {
  const [params] = useSearchParams();
  const { data, loading, error } = useAsync(() => listResource(resource), [resource]);
  const [extra, setExtra] = useState([]);
  const [q, setQ] = useState('');
  const [fv, setFv] = useState(() => Object.fromEntries(filters.map((f) => [f.key, params.get(f.key) || ''])));
  const [sort, setSort] = useState(null);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(Boolean(fields) && params.get('new') === '1');

  const all = useMemo(() => [...extra, ...(data || [])], [extra, data]);
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    const r = all.filter((row) =>
      (!s || searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(s))) &&
      filters.every((f) => !fv[f.key] || f.match(row, fv[f.key])));
    if (!sort) return r;
    return [...r].sort((a, b) => {
      const x = a[sort.key], y = b[sort.key];
      const c = typeof x === 'number' ? x - y : String(x ?? '').localeCompare(String(y ?? ''));
      return sort?.dir === 'asc' ? c : -c;
    });
  }, [all, q, fv, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const cur = Math.min(page, pages);
  const slice = rows.slice((cur - 1) * pageSize, cur * pageSize);
  const toggleSort = (key) => setSort((s) => (s?.key === key ? (s.dir === 'asc' ? { key, dir: 'desc' } : null) : { key, dir: 'asc' }));
  const filtered = q || Object.values(fv).some(Boolean);

  return (
    <>
      {!embedded && <PageHeader title={title} subtitle={subtitle} actions={fields && (
        <button onClick={() => setModal(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"><Plus className="h-4 w-4" />{addLabel}</button>)} />}
      {embedded && fields && <div className="mb-3 flex justify-end"><button onClick={() => setModal(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"><Plus className="h-4 w-4" />{addLabel}</button></div>}

      {stats && !loading && !error && (
        <dl className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats(all).map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <dt className="text-sm text-muted">{s.label}</dt><dd className="mt-1 text-xl font-semibold tabular-nums">{s.value}</dd>
            </div>))}
        </dl>)}

      <div className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-100 p-3 sm:flex-row">
          <label className="relative block flex-1">
            <span className="sr-only">Search {title}</span>
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted" />
            <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search…" className={`${input} pl-9`} />
          </label>
          {filters.map((f) => (
            <label key={f.key} className="sm:w-44">
              <span className="sr-only">{f.label}</span>
              <select value={fv[f.key]} onChange={(e) => { setFv({ ...fv, [f.key]: e.target.value }); setPage(1); }} className={input}>
                <option value="">{f.label}: All</option>
                {f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>))}
        </div>
        <div className="p-3">
          <AsyncBlock loading={loading} error={error} empty={!rows.length} height="h-56"
            emptyText={filtered ? 'No results match your search or filters.' : `No ${title.toLowerCase()} yet.${fields ? ` Use “${addLabel}” to create the first one.` : ''}`}>
            <TableWrap>
              <thead><tr>{columns.map((c) => (
                <th key={c.label} scope="col" aria-sort={sort?.key === c.key ? (sort?.dir === 'asc' ? 'ascending' : 'descending') : 'none'} className={`px-3 py-2 text-xs font-medium text-muted ${c.right ? 'text-right' : 'text-left'}`}>
                  {c.key && c.sortable !== false ? (
                    <button onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 hover:text-ink">{c.label}{sort?.key === c.key && (sort.dir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}</button>
                  ) : c.label}
                </th>))}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {slice.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    {columns.map((c) => <Td key={c.label} right={c.right} className={c.className}>{c.render ? c.render(row) : row[c.key]}</Td>)}
                  </tr>))}
              </tbody>
            </TableWrap>
            <div className="mt-3 flex items-center justify-between text-xs text-muted">
              <span>{rows.length} result{rows.length === 1 ? '' : 's'}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(cur - 1)} disabled={cur === 1} className="rounded p-1.5 hover:bg-slate-100 disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
                <span>Page {cur} of {pages}</span>
                <button onClick={() => setPage(cur + 1)} disabled={cur === pages} className="rounded p-1.5 hover:bg-slate-100 disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          </AsyncBlock>
        </div>
      </div>

      {modal && <AddModal title={addLabel} fields={fields} params={params} onClose={() => setModal(false)}
        onSubmit={async (values) => {
          // BACKEND: POST to the resource endpoint (see src/services/moduleService.js). Demo mode only adds the row locally.
          const created = await createResource(resource, values, build ? build(values, all.length) : { id: Date.now(), ...values });
          setExtra((x) => [created, ...x]); setModal(false);
        }} />}
    </>
  );
}

function AddModal({ title, fields, params, onClose, onSubmit }) {
  const [v, setV] = useState(() => Object.fromEntries(fields.map((f) => [f.key, params.get(f.key) ?? f.default ?? ''])));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setErr(null);
    try { await onSubmit(Object.fromEntries(fields.map((f) => [f.key, f.type === 'number' ? Number(v[f.key]) : v[f.key]]))); }
    catch (x) { setErr(x.message || 'Could not save'); setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <form onSubmit={submit} role="dialog" aria-modal="true" aria-label={title} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-muted hover:bg-slate-100" aria-label="Close"><X className="h-4 w-4" /></button></div>
        <div className="space-y-3">
          {fields.map((f, i) => (
            <label key={f.key} className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-muted">{f.label}</span>
              {f.type === 'select' ? (
                <select value={v[f.key]} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} required className={input}>
                  <option value="" disabled>Select…</option>{f.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : <input autoFocus={i === 0} type={f.type || 'text'} min={f.type === 'number' ? 0 : undefined} step={f.type === 'number' ? 'any' : undefined} required value={v[f.key]} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} className={input} />}
            </label>))}
        </div>
        {err && <p role="alert" className="mt-3 text-sm text-critical">{err}</p>}
        <p className="mt-3 text-xs text-muted">Demo mode: this record is added to the list locally and is not saved.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">Cancel</button>
          <button disabled={saving} className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
