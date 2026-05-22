import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import api from '../api/client';

const statusColors = {
  placed: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/me').then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container-x py-20 text-center">Loading...</div>;

  return (
    <div className="container-x py-10 animate-fade-in">
      <h1 className="heading-display text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Link to="/shop" className="btn-primary inline-flex">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o._id} to={`/order/${o._id}`} className="card p-5 flex flex-col sm:flex-row gap-4 hover:shadow-glow transition">
              <div className="flex -space-x-3">
                {o.items.slice(0, 3).map((it, i) => (
                  <img key={i} src={it.image} alt="" className="w-14 h-16 object-cover rounded-lg border-2 border-white dark:border-ink-800" />
                ))}
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500">Order #{o._id.slice(-8)}</div>
                <div className="font-medium mt-1">{o.items.map((i) => i.name).join(', ').slice(0, 60)}...</div>
                <div className="text-xs text-gray-500 mt-1">
                  {o.items.length} item(s) • {new Date(o.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">₹{o.total}</div>
                <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${statusColors[o.status] || 'bg-gray-100 text-gray-700'}`}>
                  {o.status.replace('_', ' ')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
