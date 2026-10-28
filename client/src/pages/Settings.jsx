import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import useAsync from '../hooks/useAsync';
import { getSettings, saveSettings } from '../services/moduleService';
import PageHeader from '../components/common/PageHeader';
import { AsyncBlock, Section } from '../components/common/Section';

const FIELDS = [
  ['companyName', 'Company name'], ['taxId', 'Tax ID'], ['country', 'Country'], ['email', 'Contact email', 'email'], ['phone', 'Phone'], ['address', 'Address'],
  ['currency', 'Business currency (ISO code)'], ['locale', 'Number & date format'], ['invoicePrefix', 'Invoice prefix'], ['targetStockFactor', 'Default target stock (× minimum)', 'number'],
];
export default function Settings() {
  // BACKEND: GET /api/company/settings
  const { data, loading, error } = useAsync(getSettings, []);
  const [form, setForm] = useState(null);
  const [state, setState] = useState({ saving: false, saved: false, error: null });
  useEffect(() => { if (data) setForm(data); }, [data]);
  const submit = async (e) => {
    e.preventDefault(); setState({ saving: true, saved: false, error: null });
    try { await saveSettings(form); setState({ saving: false, saved: true, error: null }); } // BACKEND: PUT /api/company/settings
    catch (x) { setState({ saving: false, saved: false, error: x.message || 'Could not save settings' }); }
  };
  return (
    <>
      <PageHeader title="Company Settings" subtitle="Business details, currency and inventory defaults" />
      <Section title="General">
        <AsyncBlock loading={loading} error={error} height="h-64">
          {form && (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {FIELDS.map(([key, label, type]) => (
                  <label key={key} className="block text-sm"><span className="mb-1 block text-xs font-medium text-muted">{label}</span>
                    <input type={type || 'text'} value={form[key]} onChange={(e) => { setForm({ ...form, [key]: type === 'number' ? Number(e.target.value) : e.target.value }); setState((s) => ({ ...s, saved: false })); }}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" /></label>))}
              </div>
              <p className="text-xs text-muted">Currency and number format are currently read from <code>VITE_CURRENCY</code> and <code>VITE_LOCALE</code>; saving here does not change them until the backend feeds <code>src/config.js</code>.</p>
              {state.error && <p role="alert" className="text-sm text-critical">{state.error}</p>}
              <div className="flex items-center gap-3">
                <button disabled={state.saving} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{state.saving ? 'Saving…' : 'Save changes'}</button>
                {state.saved && <span role="status" className="inline-flex items-center gap-1 text-sm text-ok"><CheckCircle2 className="h-4 w-4" />Changes accepted (demo — not persisted)</span>}
              </div>
            </form>)}
        </AsyncBlock>
      </Section>
    </>
  );
}
