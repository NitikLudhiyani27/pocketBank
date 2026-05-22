import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { user } = useAuth();
  const { cart, subtotal, update, remove } = useCart();

  if (!user) {
    return (
      <div className="container-x py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="heading-display text-2xl font-bold mb-2">Login to view your cart</h2>
        <Link to="/login" className="btn-primary mt-4 inline-flex">Login</Link>
      </div>
    );
  }

  if (!cart.items?.length) {
    return (
      <div className="container-x py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="heading-display text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-4">Discover something you'll love</p>
        <Link to="/shop" className="btn-primary inline-flex">Continue Shopping</Link>
      </div>
    );
  }

  const shipping = subtotal > 999 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  return (
    <div className="container-x py-8 animate-fade-in">
      <h1 className="heading-display text-3xl font-bold mb-6">Shopping Cart ({cart.items.length})</h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-3">
          {cart.items.map((it, i) => (
            <motion.div key={`${it.product._id}-${it.size}-${it.color}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card p-4 flex gap-4">
              <Link to={`/product/${it.product._id}`} className="shrink-0">
                <img src={it.product.images?.[0]} alt="" className="w-24 h-32 object-cover rounded-xl" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${it.product._id}`} className="font-medium hover:text-brand-600 line-clamp-1 block">{it.product.name}</Link>
                <div className="text-xs text-gray-500 mt-1">
                  {it.size && <span>Size: {it.size}</span>}
                  {it.size && it.color && <span> • </span>}
                  {it.color && <span>Color: {it.color}</span>}
                </div>
                <div className="font-semibold mt-2">₹{it.product.price}</div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 border border-gray-200 dark:border-ink-700 rounded-full">
                    <button onClick={() => update(it.product._id, it.size, it.color, it.qty - 1)} className="p-2"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm">{it.qty}</span>
                    <button onClick={() => update(it.product._id, it.size, it.color, it.qty + 1)} className="p-2"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => remove(it.product._id, it.size, it.color)}
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-ink-700 p-2 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <aside className="card p-6 h-fit sticky top-20">
          <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
          <Row label="Subtotal" value={`₹${subtotal}`} />
          <Row label="Shipping" value={shipping === 0 ? 'FREE' : `₹${shipping}`} />
          <Row label="Tax (5%)" value={`₹${tax}`} />
          <div className="border-t border-gray-100 dark:border-ink-700 my-3" />
          <Row label="Total" value={`₹${total}`} bold />
          <Link to="/checkout" className="btn-primary w-full mt-4">Proceed to Checkout</Link>
          <Link to="/shop" className="btn-ghost w-full mt-2 text-sm">Continue Shopping</Link>
          <p className="text-xs text-gray-500 mt-3">Have a coupon? Apply at checkout.</p>
        </aside>
      </div>
    </div>
  );
}

const Row = ({ label, value, bold }) => (
  <div className={`flex justify-between text-sm py-1 ${bold ? 'font-bold text-base' : ''}`}>
    <span>{label}</span><span>{value}</span>
  </div>
);
