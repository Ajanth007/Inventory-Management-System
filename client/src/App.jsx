import { Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Placeholder from './pages/Placeholder';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Inventory from './pages/Inventory';
import Suppliers from './pages/Suppliers';
import Purchases from './pages/Purchases';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import Accounting from './pages/Accounting';
import Users from './pages/Users';
import Settings from './pages/Settings';
import AuditLogs from './pages/AuditLogs';

const PAGES = {
  '/products': Products, '/categories': Categories, '/inventory': Inventory, '/suppliers': Suppliers, '/purchases': Purchases,
  '/customers': Customers, '/sales': Sales, '/invoices': Invoices, '/payments': Payments, '/expenses': Expenses,
  '/accounting': Accounting, '/users': Users, '/settings': Settings, '/audit-logs': AuditLogs,
};
export default function App() {
  // BACKEND: Wrap these routes in an authentication guard once login exists.
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        {Object.entries(PAGES).map(([path, Page]) => <Route key={path} path={path} element={<Page />} />)}
        <Route path="*" element={<Placeholder />} />
      </Route>
    </Routes>
  );
}
