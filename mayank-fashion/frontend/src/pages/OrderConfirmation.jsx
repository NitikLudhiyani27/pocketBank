import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Home as HomeIcon, Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/client';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.order));
  }, [id]);

  if (!order) return <div className="container-x py-20 text-center">Loading...</div>;

  const steps = [
    { k: 'placed', l: 'Order Placed', icon: <CheckCircle2 size={18} /> },
    { k: 'confirmed', l: 'Confirmed', icon: <Package size={18} /> },
    { k: 'shipped', l: 'Shipped', icon: <Truck size={18} /> },
    { k: 'delivered', l: 'Delivered', icon: <HomeIcon size={18} /> },
  ];
  const currentIdx = steps.findIndex((s) => s.k === order.status);

  return (
    <div className="container-x py-12 animate-fade-in">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="heading-display text-3xl font-bold">Thank you for your order!</h1>
        <p className="text-gray-500 mt-2">Order ID: <b>{order._id}</b></p>
        {order.trackingId && <p className="text-gray-500 text-sm">Tracking: {order.trackingId}</p>}
      </motion.div>

      {/* Tracker */}
      <div className="card p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.k} className="flex-1 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full grid place-items-center
                ${i <= currentIdx ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-ink-700 text-gray-400'}`}>
                {s.icon}
              </div>
              <div className={`text-xs mt-2 ${i <= currentIdx ? 'text-brand-600 font-semibold' : 'text-gray-400'}`}>{s.l}</div>
              {i < steps.length - 1 && (
                <div className={`hidden sm:block absolute h-0.5 w-full -z-10`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6 max-w-3xl mx-auto">
        <div className="card p-5">
          <h3 className="font-semibold mb-3">Shipping Address</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {order.address.fullName}<br />
            {order.address.line1}{order.address.line2 ? ', ' + order.address.line2 : ''}<br />
            {order.address.city}, {order.address.state} {order.address.pincode}<br />
            {order.address.country} • {order.address.phone}
          </p>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{order.discount}</span></div>}
            <div className="flex justify-between"><span>Shipping</span><span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{order.tax}</span></div>
            <div className="border-t border-gray-100 dark:border-ink-700 my-2" />
            <div className="flex justify-between font-bold"><span>Total</span><span>₹{order.total}</span></div>
            <div className="text-xs text-gray-500">Payment: {order.paymentMethod}</div>
          </div>
        </div>
      </div>

      <div className="card p-5 max-w-3xl mx-auto mt-4">
        <h3 className="font-semibold mb-3">Items ({order.items.length})</h3>
        <div className="space-y-3">
          {order.items.map((it, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <img src={it.image} alt="" className="w-14 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="font-medium">{it.name}</div>
                <div className="text-xs text-gray-500">Qty: {it.qty} {it.size && `• ${it.size}`} {it.color && `• ${it.color}`}</div>
              </div>
              <div className="font-semibold">₹{it.price * it.qty}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8 flex flex-wrap items-center justify-center gap-3 print:hidden">
        <button onClick={() => window.print()} className="btn-outline">
          <Printer size={16} /> Print Invoice
        </button>
        <Link to="/orders" className="btn-outline">View All Orders</Link>
        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    </div>
  );
}
