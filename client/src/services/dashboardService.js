import { api, demo, IS_DEMO } from './http';
import * as mock from '../data/dashboardMockData';

const get = async (url, params, fallback) => (IS_DEMO ? demo(fallback) : (await api.get(url, { params })).data);

// range: 'today' | '7d' | '30d' | 'month'  (demo data ignores it)

// BACKEND: GET /api/dashboard/summary?range=
// Expected: { totalProducts, stockValue, todaySales, todayTransactions, monthlySales, monthlySalesChange,
//             lowStock, outOfStock, pendingPayments, pendingInvoices, todayPurchases }
export const getDashboardSummary = (range) => get('/api/dashboard/summary', { range }, mock.mockSummary);

// BACKEND: GET /api/dashboard/stock-alerts
// Expected: [{ id, name, sku, available, minStock, targetStock? }]   (status is computed on the frontend)
export const getStockAlerts = () => get('/api/dashboard/stock-alerts', {}, mock.mockStockAlerts);

// BACKEND: GET /api/dashboard/monthly-sales?months=6
// Expected: [{ month: 'Oct', sales: 41250 }]
export const getMonthlySales = () => get('/api/dashboard/monthly-sales', { months: 6 }, mock.mockMonthlySales);

// BACKEND: GET /api/dashboard/purchase-vs-sales?months=6
// Expected: [{ month, sales, purchases }]
export const getPurchaseVsSales = () => get('/api/dashboard/purchase-vs-sales', { months: 6 }, mock.mockPurchaseVsSales);

// BACKEND: GET /api/dashboard/top-products?range=
// Expected: [{ id, name, sku, unitsSold, revenue, stock }]
export const getTopProducts = (range) => get('/api/dashboard/top-products', { range }, mock.mockTopProducts);

// BACKEND: GET /api/dashboard/recent-sales
// Expected: [{ id, number, customer, date, total, paymentStatus: paid|partial|pending, status: completed|confirmed|cancelled }]
export const getRecentSales = () => get('/api/dashboard/recent-sales', {}, mock.mockRecentSales);

// BACKEND: GET /api/dashboard/recent-purchases
// Expected: [{ id, number, supplier, date, total, status: draft|ordered|received }]
export const getRecentPurchases = () => get('/api/dashboard/recent-purchases', {}, mock.mockRecentPurchases);

// BACKEND: GET /api/dashboard/recent-activity
// Expected: [{ id, type: sale|purchase|payment|adjust|invoice|product, text, at (ISO), user? }]
export const getRecentActivity = () => get('/api/dashboard/recent-activity', {}, mock.mockRecentActivity);
