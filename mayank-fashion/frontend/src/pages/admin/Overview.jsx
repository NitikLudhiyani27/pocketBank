import { useEffect, useState } from 'react';
import { Users, Package, ShoppingBag, IndianRupee } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../api/client';

export default function Overview() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/admin/stats').then(({ data }) => setData(data)); }, []);
  if (!data) return <div>Loading...</div>;

  const cards = [
    { i: <IndianRupee />, l: 'Revenue', v: `₹${data.counts.revenue.toLocaleString()}`, c: 'from-emerald-500 to-emerald-700' },
    { i: <ShoppingBag />, l: 'Orders', v: data.counts.orders, c: 'from-brand-500 to-brand-700' },
    { i: <Package />, l: 'Products', v: data.counts.products, c: 'from-amber-500 to-amber-700' },
    { i: <Users />, l: 'Customers', v: data.counts.users, c: 'from-indigo-500 to-indigo-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.l} className={`relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br ${c.c}`}>
            <div className="opacity-90">{c.i}</div>
            <div className="text-2xl font-bold mt-3">{c.v}</div>
            <div className="text-xs opacity-80">{c.l}</div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-3">Sales (Last 7 days)</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={data.sales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="_id" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#db2777" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold mb-3">Recent Orders</h3>
          <div className="space-y-2">
            {data.recentOrders.map((o) => (
              <div key={o._id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 dark:border-ink-700 last:border-0">
                <div>
                  <div className="font-medium">#{o._id.slice(-8)}</div>
                  <div className="text-xs text-gray-500">{o.user?.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{o.total}</div>
                  <div className="text-xs text-gray-500">{o.status}</div>
                </div>
              </div>
            ))}
            {data.recentOrders.length === 0 && <div className="text-sm text-gray-500">No orders yet.</div>}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-3">Low Stock Alerts</h3>
          <div className="space-y-2">
            {data.lowStock.map((p) => (
              <div key={p._id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 dark:border-ink-700 last:border-0">
                <div className="flex items-center gap-2 min-w-0">
                  <img src={p.images?.[0]} className="w-8 h-10 object-cover rounded" alt="" />
                  <div className="line-clamp-1">{p.name}</div>
                </div>
                <span className="text-red-600 font-medium text-xs">{p.stock} left</span>
              </div>
            ))}
            {data.lowStock.length === 0 && <div className="text-sm text-gray-500">All stock healthy.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
