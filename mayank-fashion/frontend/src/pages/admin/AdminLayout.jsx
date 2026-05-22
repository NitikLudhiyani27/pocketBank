import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Tag } from 'lucide-react';

const items = [
  { to: '/admin', icon: <LayoutDashboard size={16} />, label: 'Overview', end: true },
  { to: '/admin/products', icon: <Package size={16} />, label: 'Products' },
  { to: '/admin/orders', icon: <ShoppingBag size={16} />, label: 'Orders' },
  { to: '/admin/users', icon: <Users size={16} />, label: 'Customers' },
  { to: '/admin/coupons', icon: <Tag size={16} />, label: 'Coupons' },
];

export default function AdminLayout() {
  return (
    <div className="container-x py-8 animate-fade-in">
      <h1 className="heading-display text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <aside>
          <nav className="card p-2 lg:sticky lg:top-20 flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
            {items.map((it) => (
              <NavLink key={it.to} to={it.to} end={it.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    isActive ? 'bg-brand-600 text-white' : 'hover:bg-brand-50 dark:hover:bg-ink-700'
                  }`
                }>
                {it.icon} {it.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div><Outlet /></div>
      </div>
    </div>
  );
}
