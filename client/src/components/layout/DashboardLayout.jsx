import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8"><Outlet context={{ openMenu: () => setOpen(true) }} /></main>
      </div>
    </div>
  );
}
