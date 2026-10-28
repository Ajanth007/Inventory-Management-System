import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import DashboardHeader from '../components/layout/DashboardHeader';
import SummaryGrid from '../components/dashboard/SummaryGrid';
import StockAlerts from '../components/dashboard/StockAlerts';
import SalesChart from '../components/dashboard/SalesChart';
import PurchaseSalesChart from '../components/dashboard/PurchaseSalesChart';
import TopProducts from '../components/dashboard/TopProducts';
import RecentSales from '../components/dashboard/RecentSales';
import RecentPurchases from '../components/dashboard/RecentPurchases';
import RecentActivity from '../components/dashboard/RecentActivity';

export default function Dashboard() {
  const { openMenu } = useOutletContext();
  const [range, setRange] = useState('30d');
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // bumping this re-runs every section's fetch
  const [spinning, setSpinning] = useState(false);
  const refresh = () => { setRefreshKey((k) => k + 1); setSpinning(true); setTimeout(() => setSpinning(false), 700); };
  const p = { range, refreshKey };
  return (
    <>
      <DashboardHeader onMenu={openMenu} search={search} onSearch={setSearch} range={range} onRange={setRange} onRefresh={refresh} refreshing={spinning} />
      <div className="space-y-5">
        <SummaryGrid {...p} />
        <StockAlerts refreshKey={refreshKey} search={search} />
        <div className="grid gap-5 lg:grid-cols-2"><SalesChart refreshKey={refreshKey} /><PurchaseSalesChart refreshKey={refreshKey} /></div>
        <div className="grid gap-5 xl:grid-cols-3">
          <div className="min-w-0 xl:col-span-2"><TopProducts {...p} /></div>
          <RecentActivity refreshKey={refreshKey} />
        </div>
        <div className="grid gap-5 xl:grid-cols-2"><RecentSales refreshKey={refreshKey} /><RecentPurchases refreshKey={refreshKey} /></div>
      </div>
    </>
  );
}
