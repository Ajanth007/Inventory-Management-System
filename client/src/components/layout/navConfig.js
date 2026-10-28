import { LayoutDashboard, Package, Tags, ArrowLeftRight, Truck, ShoppingBag, Users, ShoppingCart, FileText, CreditCard, Receipt, BarChart3, ShieldCheck, Settings, ScrollText } from 'lucide-react';
export const NAV = [
  { group: 'Main', items: [
    { label: 'Dashboard', to: '/', icon: LayoutDashboard },
    { label: 'Products', to: '/products', icon: Package },
    { label: 'Categories', to: '/categories', icon: Tags } ] },
  { group: 'Inventory', items: [
    { label: 'Inventory / Stock Movements', to: '/inventory', icon: ArrowLeftRight },
    { label: 'Suppliers', to: '/suppliers', icon: Truck },
    { label: 'Purchases', to: '/purchases', icon: ShoppingBag } ] },
  { group: 'Sales', items: [
    { label: 'Customers', to: '/customers', icon: Users },
    { label: 'Sales & Orders', to: '/sales', icon: ShoppingCart },
    { label: 'Invoices', to: '/invoices', icon: FileText },
    { label: 'Payments', to: '/payments', icon: CreditCard } ] },
  { group: 'Finance', items: [
    { label: 'Expenses', to: '/expenses', icon: Receipt },
    { label: 'Accounting & Reports', to: '/accounting', icon: BarChart3 } ] },
  { group: 'Administration', items: [
    { label: 'Users & Roles', to: '/users', icon: ShieldCheck },
    { label: 'Company Settings', to: '/settings', icon: Settings },
    { label: 'Audit Logs', to: '/audit-logs', icon: ScrollText } ] },
];
