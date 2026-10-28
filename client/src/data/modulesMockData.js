// DEMO DATA ONLY — none of this comes from a backend.
const d = (n) => new Date(Date.now() - n * 86400000).toISOString();

export const mockProducts = [
  { id: 1, name: 'Wireless Mouse', sku: 'ELEC-001', category: 'Electronics', cost: 12.5, price: 25, stock: 2, minStock: 10 },
  { id: 2, name: 'Keyboard', sku: 'ELEC-002', category: 'Electronics', cost: 16, price: 40, stock: 7, minStock: 10 },
  { id: 3, name: 'Monitor 24"', sku: 'ELEC-003', category: 'Electronics', cost: 110, price: 175, stock: 25, minStock: 10 },
  { id: 4, name: 'USB Cable', sku: 'ACC-001', category: 'Accessories', cost: 2.4, price: 8, stock: 0, minStock: 10 },
  { id: 5, name: 'HDMI Adapter', sku: 'ACC-014', category: 'Accessories', cost: 5, price: 14, stock: 1, minStock: 8 },
  { id: 6, name: 'Laptop Stand', sku: 'ACC-020', category: 'Accessories', cost: 14, price: 30, stock: 6, minStock: 8 },
  { id: 7, name: 'Webcam HD', sku: 'ELEC-011', category: 'Electronics', cost: 28, price: 55, stock: 0, minStock: 5 },
  { id: 8, name: 'A4 Paper (500 sheets)', sku: 'OFF-001', category: 'Office', cost: 3.2, price: 6.5, stock: 140, minStock: 40 },
  { id: 9, name: 'Ballpoint Pens (12)', sku: 'OFF-007', category: 'Office', cost: 1.1, price: 3, stock: 90, minStock: 30 },
  { id: 10, name: 'Desk Lamp', sku: 'HOME-004', category: 'Home', cost: 9, price: 22, stock: 18, minStock: 6 },
];
export const mockCategories = [
  { id: 1, name: 'Electronics', description: 'Computers and peripherals', products: 4, status: 'active' },
  { id: 2, name: 'Accessories', description: 'Cables, adapters and stands', products: 3, status: 'active' },
  { id: 3, name: 'Office', description: 'Paper and stationery', products: 2, status: 'active' },
  { id: 4, name: 'Home', description: 'Lighting and small appliances', products: 1, status: 'active' },
  { id: 5, name: 'Seasonal', description: 'Limited-time items', products: 0, status: 'inactive' },
];
export const mockMovements = [
  { id: 1, date: d(0), product: 'Monitor 24"', sku: 'ELEC-003', type: 'in', qty: 10, reference: 'P-0188', user: 'Luis M.' },
  { id: 2, date: d(0), product: 'Wireless Mouse', sku: 'ELEC-001', type: 'out', qty: -6, reference: 'S-0412', user: 'Camila R.' },
  { id: 3, date: d(1), product: 'USB Cable', sku: 'ACC-001', type: 'adjustment', qty: -6, reference: 'Damaged units', user: 'Luis M.' },
  { id: 4, date: d(2), product: 'Keyboard', sku: 'ELEC-002', type: 'out', qty: -12, reference: 'S-0409', user: 'Camila R.' },
  { id: 5, date: d(3), product: 'A4 Paper (500 sheets)', sku: 'OFF-001', type: 'in', qty: 100, reference: 'P-0186', user: 'Luis M.' },
  { id: 6, date: d(4), product: 'Laptop Stand', sku: 'ACC-020', type: 'out', qty: -8, reference: 'S-0405', user: 'Ana P.' },
  { id: 7, date: d(5), product: 'Webcam HD', sku: 'ELEC-011', type: 'adjustment', qty: 2, reference: 'Count correction', user: 'Ana P.' },
];
export const mockSuppliers = [
  { id: 1, name: 'TecnoImport SA', contact: 'Jorge Salas', email: 'ventas@tecnoimport.example', phone: '+52 55 5550 1100', country: 'Mexico', balance: 1560, status: 'active' },
  { id: 2, name: 'Accesorios del Sur', contact: 'María Vega', email: 'maria@accsur.example', phone: '+56 2 2555 0199', country: 'Chile', balance: 780, status: 'active' },
  { id: 3, name: 'Global Parts', contact: 'Tom Reyes', email: 'tom@globalparts.example', phone: '+1 305 555 0142', country: 'USA', balance: 0, status: 'active' },
  { id: 4, name: 'Papelera Andina', contact: 'Rosa Quispe', email: 'rosa@papelera.example', phone: '+51 1 555 0123', country: 'Peru', balance: 210, status: 'inactive' },
];
export const mockPurchases = [
  { id: 1, number: 'P-0188', supplier: 'TecnoImport SA', date: d(0), total: 1560, status: 'received' },
  { id: 2, number: 'P-0187', supplier: 'Accesorios del Sur', date: d(2), total: 780, status: 'ordered' },
  { id: 3, number: 'P-0186', supplier: 'Global Parts', date: d(4), total: 2240, status: 'received' },
  { id: 4, number: 'P-0185', supplier: 'TecnoImport SA', date: d(6), total: 530, status: 'draft' },
  { id: 5, number: 'P-0184', supplier: 'Papelera Andina', date: d(9), total: 320, status: 'cancelled' },
];
export const mockCustomers = [
  { id: 1, name: 'Distribuidora Andina', email: 'compras@andina.example', phone: '+57 1 555 0101', city: 'Bogotá', balance: 0, status: 'active' },
  { id: 2, name: 'Tienda La Esquina', email: 'hola@laesquina.example', phone: '+52 33 5550 0188', city: 'Guadalajara', balance: 342.5, status: 'active' },
  { id: 3, name: 'Papelería Central', email: 'info@papcentral.example', phone: '+54 11 5550 0144', city: 'Buenos Aires', balance: 365, status: 'active' },
  { id: 4, name: 'Ferretería Norte', email: 'norte@ferre.example', phone: '+56 2 5550 0177', city: 'Santiago', balance: 0, status: 'active' },
  { id: 5, name: 'Café Mirador', email: 'cafe@mirador.example', phone: '+51 1 5550 0166', city: 'Lima', balance: 74.9, status: 'inactive' },
];
export const mockSales = [
  { id: 1, number: 'S-0412', customer: 'Distribuidora Andina', date: d(0), total: 1280, paymentStatus: 'paid', status: 'completed' },
  { id: 2, number: 'S-0411', customer: 'Tienda La Esquina', date: d(0), total: 342.5, paymentStatus: 'pending', status: 'confirmed' },
  { id: 3, number: 'S-0410', customer: 'Papelería Central', date: d(1), total: 865, paymentStatus: 'partial', status: 'confirmed' },
  { id: 4, number: 'S-0409', customer: 'Ferretería Norte', date: d(2), total: 120, paymentStatus: 'paid', status: 'completed' },
  { id: 5, number: 'S-0408', customer: 'Café Mirador', date: d(3), total: 74.9, paymentStatus: 'pending', status: 'cancelled' },
];
export const mockInvoices = [
  { id: 1, number: 'INV-0331', customer: 'Tienda La Esquina', issued: d(1), due: d(-14), total: 342.5, paid: 0, status: 'pending' },
  { id: 2, number: 'INV-0330', customer: 'Distribuidora Andina', issued: d(2), due: d(-13), total: 1280, paid: 1280, status: 'paid' },
  { id: 3, number: 'INV-0329', customer: 'Papelería Central', issued: d(3), due: d(-12), total: 865, paid: 500, status: 'partial' },
  { id: 4, number: 'INV-0322', customer: 'Café Mirador', issued: d(40), due: d(10), total: 74.9, paid: 0, status: 'overdue' },
  { id: 5, number: 'INV-0318', customer: 'Ferretería Norte', issued: d(45), due: d(15), total: 410, paid: 0, status: 'overdue' },
];
export const mockPayments = [
  { id: 1, ref: 'PAY-0207', date: d(0), customer: 'Distribuidora Andina', invoice: 'INV-0330', method: 'transfer', amount: 1280 },
  { id: 2, ref: 'PAY-0206', date: d(1), customer: 'Papelería Central', invoice: 'INV-0329', method: 'card', amount: 500 },
  { id: 3, ref: 'PAY-0205', date: d(3), customer: 'Ferretería Norte', invoice: 'INV-0315', method: 'cash', amount: 120 },
  { id: 4, ref: 'PAY-0204', date: d(6), customer: 'Tienda La Esquina', invoice: 'INV-0311', method: 'transfer', amount: 640 },
];
export const mockExpenses = [
  { id: 1, date: d(1), category: 'Rent', description: 'Warehouse rent — October', vendor: 'Inmobiliaria Centro', amount: 1800, status: 'paid' },
  { id: 2, date: d(3), category: 'Utilities', description: 'Electricity', vendor: 'Compañía Eléctrica', amount: 214.3, status: 'paid' },
  { id: 3, date: d(5), category: 'Payroll', description: 'Payroll — second half', vendor: 'Internal', amount: 4200, status: 'paid' },
  { id: 4, date: d(7), category: 'Logistics', description: 'Courier shipments', vendor: 'RápidoEnvíos', amount: 389.9, status: 'pending' },
  { id: 5, date: d(10), category: 'Marketing', description: 'Social media ads', vendor: 'Meta Ads', amount: 250, status: 'paid' },
];
export const mockUsers = [
  { id: 1, name: 'Camila Rojas', email: 'camila@opera.demo', role: 'Administrator', status: 'active', lastLogin: d(0) },
  { id: 2, name: 'Luis Méndez', email: 'luis@opera.demo', role: 'Warehouse', status: 'active', lastLogin: d(0) },
  { id: 3, name: 'Ana Paredes', email: 'ana@opera.demo', role: 'Accountant', status: 'active', lastLogin: d(2) },
  { id: 4, name: 'Diego Fuentes', email: 'diego@opera.demo', role: 'Sales', status: 'invited', lastLogin: null },
  { id: 5, name: 'Sofía Luna', email: 'sofia@opera.demo', role: 'Sales', status: 'inactive', lastLogin: d(60) },
];
export const mockAuditLogs = [
  { id: 1, at: d(0), user: 'Camila R.', action: 'create', entity: 'Sale S-0412', details: 'Sale confirmed and stock deducted', ip: '190.12.4.21' },
  { id: 2, at: d(0), user: 'Luis M.', action: 'update', entity: 'Purchase P-0188', details: 'Status changed to received', ip: '190.12.4.35' },
  { id: 3, at: d(1), user: 'Luis M.', action: 'update', entity: 'Product ACC-001', details: 'Stock adjusted −6', ip: '190.12.4.35' },
  { id: 4, at: d(2), user: 'Ana P.', action: 'create', entity: 'Invoice INV-0331', details: 'Invoice generated', ip: '190.12.4.40' },
  { id: 5, at: d(3), user: 'Camila R.', action: 'update', entity: 'User Sofía Luna', details: 'Account deactivated', ip: '190.12.4.21' },
  { id: 6, at: d(4), user: 'Unknown', action: 'login_failed', entity: 'Auth', details: 'Failed login for diego@opera.demo', ip: '201.55.9.8' },
];
export const mockAccounting = {
  kpis: { revenue: 41250, expenses: 29100, netProfit: 12150, receivables: 9870.2 },
  monthly: [['May', 28400, 21900], ['Jun', 31200, 23400], ['Jul', 29800, 24100], ['Aug', 35600, 25800], ['Sep', 38100, 27300], ['Oct', 41250, 29100]]
    .map(([month, revenue, expenses]) => ({ month, revenue, expenses })),
  reports: [
    { id: 1, name: 'Profit & Loss', description: 'Revenue, costs and net profit for the period' },
    { id: 2, name: 'Balance Sheet', description: 'Assets, liabilities and equity' },
    { id: 3, name: 'Cash Flow', description: 'Money in and out by category' },
    { id: 4, name: 'Tax Summary', description: 'Sales tax collected and paid' },
    { id: 5, name: 'Inventory Valuation', description: 'Stock quantity × cost price by product' },
  ],
};
export const mockSettings = {
  companyName: 'Comercial Opera S.A.', taxId: 'COP-123456-7', country: 'Mexico', email: 'contacto@opera.demo',
  phone: '+52 55 5550 0100', address: 'Av. Reforma 100, CDMX', currency: 'USD', locale: 'es-MX',
  invoicePrefix: 'INV-', targetStockFactor: 3,
};
