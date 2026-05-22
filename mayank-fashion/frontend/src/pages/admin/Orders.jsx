import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

const STATUSES = ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const load = () => api.get('/orders').then(({ data }) => setOrders(data.orders));
  useEffect(() => { load(); }, []);

  const update = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status });
    toast.success(`Updated to ${status}`);
    load();
  };

  return (
    <div>
      <h2 className="heading-display text-xl font-bold mb-4">Orders ({orders.length})</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-ink-700/60 text-left">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t border-gray-50 dark:border-ink-700">
                <td className="p-3 font-mono text-xs">#{o._id.slice(-8)}</td>
                <td className="p-3">
                  <div>{o.user?.name}</div>
                  <div className="text-xs text-gray-500">{o.user?.email}</div>
                </td>
                <td className="p-3 font-semibold">₹{o.total}</td>
                <td className="p-3 text-xs">
                  <div>{o.paymentMethod}</div>
                  <div className={`${o.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>{o.paymentStatus}</div>
                </td>
                <td className="p-3">
                  <select className="input !py-1 !px-2 text-xs" value={o.status} onChange={(e) => update(o._id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3 text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <div className="p-8 text-center text-gray-500 text-sm">No orders yet.</div>}
      </div>
    </div>
  );
}
