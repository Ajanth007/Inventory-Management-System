// DEMO DATA ONLY — none of this comes from a backend.
const iso = (minsAgo) => new Date(Date.now() - minsAgo * 60000).toISOString();
const day = (n) => iso(n * 1440);

export const mockUser = { name: 'Camila Rojas', role: 'Administrator', email: 'camila@opera.demo' };

export const mockSummary = {
  totalProducts: 248, stockValue: 86420.5, todaySales: 3280.75, todayTransactions: 14,
  monthlySales: 41250, monthlySalesChange: 8.4, lowStock: 12, outOfStock: 4,
  pendingPayments: 9870.2, pendingInvoices: 11, todayPurchases: 1560,
};

export const mockStockAlerts = [
  { id: 1, name: 'Wireless Mouse', sku: 'ELEC-001', available: 2, minStock: 10, targetStock: 40 },
  { id: 2, name: 'Keyboard', sku: 'ELEC-002', available: 7, minStock: 10, targetStock: 30 },
  { id: 3, name: 'USB Cable', sku: 'ACC-001', available: 0, minStock: 10, targetStock: 50 },
  { id: 4, name: 'Monitor 24"', sku: 'ELEC-003', available: 25, minStock: 10, targetStock: 30 },
  { id: 5, name: 'HDMI Adapter', sku: 'ACC-014', available: 1, minStock: 8 },
  { id: 6, name: 'Laptop Stand', sku: 'ACC-020', available: 6, minStock: 8, targetStock: 24 },
  { id: 7, name: 'Webcam HD', sku: 'ELEC-011', available: 0, minStock: 5, targetStock: 15 },
];

const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const sales = [28400, 31200, 29800, 35600, 38100, 41250];
const purchases = [19800, 22100, 24500, 23900, 27300, 29100];
export const mockMonthlySales = months.map((month, i) => ({ month, sales: sales[i] }));
export const mockPurchaseVsSales = months.map((month, i) => ({ month, sales: sales[i], purchases: purchases[i] }));

export const mockTopProducts = [
  { id: 1, name: 'Wireless Mouse', sku: 'ELEC-001', unitsSold: 182, revenue: 4550, stock: 2 },
  { id: 2, name: 'Monitor 24"', sku: 'ELEC-003', unitsSold: 64, revenue: 11200, stock: 25 },
  { id: 3, name: 'Keyboard', sku: 'ELEC-002', unitsSold: 121, revenue: 4840, stock: 7 },
  { id: 4, name: 'USB Cable', sku: 'ACC-001', unitsSold: 240, revenue: 1920, stock: 0 },
  { id: 5, name: 'Laptop Stand', sku: 'ACC-020', unitsSold: 58, revenue: 1740, stock: 6 },
];

export const mockRecentSales = [
  { id: 1, number: 'S-0412', customer: 'Distribuidora Andina', date: day(0), total: 1280, paymentStatus: 'paid', status: 'completed' },
  { id: 2, number: 'S-0411', customer: 'Tienda La Esquina', date: day(0), total: 342.5, paymentStatus: 'pending', status: 'confirmed' },
  { id: 3, number: 'S-0410', customer: 'Papelería Central', date: day(1), total: 865, paymentStatus: 'partial', status: 'confirmed' },
  { id: 4, number: 'S-0409', customer: 'Ferretería Norte', date: day(2), total: 120, paymentStatus: 'paid', status: 'completed' },
  { id: 5, number: 'S-0408', customer: 'Café Mirador', date: day(3), total: 74.9, paymentStatus: 'pending', status: 'cancelled' },
];

export const mockRecentPurchases = [
  { id: 1, number: 'P-0188', supplier: 'TecnoImport SA', date: day(0), total: 1560, status: 'received' },
  { id: 2, number: 'P-0187', supplier: 'Accesorios del Sur', date: day(2), total: 780, status: 'ordered' },
  { id: 3, number: 'P-0186', supplier: 'Global Parts', date: day(4), total: 2240, status: 'received' },
  { id: 4, number: 'P-0185', supplier: 'TecnoImport SA', date: day(6), total: 530, status: 'draft' },
];

export const mockRecentActivity = [
  { id: 1, type: 'sale', text: 'Sale S-0412 completed', at: iso(12), user: 'Camila R.' },
  { id: 2, type: 'purchase', text: 'Purchase P-0188 received', at: iso(55), user: 'Luis M.' },
  { id: 3, type: 'payment', text: 'Payment of $500.00 recorded for S-0410', at: iso(130), user: 'Camila R.' },
  { id: 4, type: 'adjust', text: 'Stock adjusted for USB Cable (−6)', at: iso(300), user: 'Luis M.' },
  { id: 5, type: 'invoice', text: 'Invoice INV-0331 generated', at: iso(520), user: 'Ana P.' },
  { id: 6, type: 'product', text: 'New product added: Webcam HD', at: iso(1500), user: 'Ana P.' },
];
