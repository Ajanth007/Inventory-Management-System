import { api, demo, IS_DEMO } from './http';
import * as m from '../data/modulesMockData';

// BACKEND: Each resource below is a PROPOSED REST endpoint. Do not assume it exists.
// Expected list response: an array of objects shaped like the matching mock in src/data/modulesMockData.js
// (add server-side search / filter / pagination via query params when the lists grow).
const RESOURCES = {
  products: ['/api/products', m.mockProducts],
  categories: ['/api/categories', m.mockCategories],
  movements: ['/api/inventory/movements', m.mockMovements],
  suppliers: ['/api/suppliers', m.mockSuppliers],
  purchases: ['/api/purchases', m.mockPurchases],
  customers: ['/api/customers', m.mockCustomers],
  sales: ['/api/sales', m.mockSales],
  invoices: ['/api/invoices', m.mockInvoices],
  payments: ['/api/payments', m.mockPayments],
  expenses: ['/api/expenses', m.mockExpenses],
  users: ['/api/users', m.mockUsers],
  auditLogs: ['/api/audit-logs', m.mockAuditLogs],
};

// BACKEND: GET <endpoint> for the resource (see RESOURCES above)
export const listResource = async (name) => {
  const [url, fallback] = RESOURCES[name];
  return IS_DEMO ? demo(fallback) : (await api.get(url)).data;
};

// BACKEND: POST <endpoint> with `payload` (form values). The server returns the created record.
// In demo mode `demoRow` (built on the frontend) is returned instead and nothing is persisted.
export const createResource = async (name, payload, demoRow) =>
  IS_DEMO ? demo(demoRow) : (await api.post(RESOURCES[name][0], payload)).data;

// BACKEND: GET /api/accounting/overview?range=
// Expected: { kpis: { revenue, expenses, netProfit, receivables }, monthly: [{ month, revenue, expenses }], reports: [{ id, name, description }] }
export const getAccounting = async () => (IS_DEMO ? demo(m.mockAccounting) : (await api.get('/api/accounting/overview')).data);

// BACKEND: GET /api/company/settings
export const getSettings = async () => (IS_DEMO ? demo(m.mockSettings) : (await api.get('/api/company/settings')).data);
// BACKEND: PUT /api/company/settings — also use this to supply the business currency/locale to src/config.js
export const saveSettings = async (values) => (IS_DEMO ? demo(values) : (await api.put('/api/company/settings', values)).data);
