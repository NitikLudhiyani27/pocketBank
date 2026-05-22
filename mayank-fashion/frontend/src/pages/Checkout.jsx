import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, CreditCard, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { cart, subtotal, refresh } = useCart();
  const nav = useNavigate();
  const [address, setAddress] = useState({
    fullName: '', phone: '', line1: '', line2: '',
    city: '', state: '', pincode: '', country: 'India',
  });
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);

  const shipping = subtotal - discount > 999 || subtotal === 0 ? 0 : 49;
  const tax = Math.round(Math.max(0, (subtotal - discount)) * 0.05);
  const total = Math.max(0, subtotal - discount) + shipping + tax;

  if (!cart.items?.length) {
    return (
      <div className="container-x py-20 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const { data } = await api.post('/coupons/apply', { code: coupon, subtotal });
      setDiscount(data.discount);
      setAppliedCode(data.coupon.code);
      toast.success(`Coupon ${data.coupon.code} applied: -₹${data.discount}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Invalid coupon');
      setDiscount(0); setAppliedCode('');
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    for (const k of ['fullName', 'phone', 'line1', 'city', 'state', 'pincode']) {
      if (!address[k]) return toast.error('Please fill all required address fields');
    }
    setPlacing(true);
    try {
      // For RAZORPAY/MOCK: create payment order, then place order
      let paymentId = null;
      if (paymentMethod !== 'COD') {
        const { data: po } = await api.post('/payment/create-order', { amount: total });
        // In a real Razorpay flow, you'd open the checkout widget here.
        // For demo, mock success:
        const { data: vr } = await api.post('/payment/verify', { mock: true });
        paymentId = vr.paymentId;
      }

      const { data } = await api.post('/orders', {
        address, paymentMethod, couponCode: appliedCode || undefined, paymentId,
      });
      await refresh();
      toast.success('Order placed!');
      nav(`/order/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order');
    } finally { setPlacing(false); }
  };

  return (
    <form onSubmit={placeOrder} className="container-x py-8 animate-fade-in">
      <h1 className="heading-display text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        <div className="space-y-6">
          <section className="card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Truck size={18} /> Shipping Address</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <input className="input" placeholder="Full Name *" value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
              <input className="input" placeholder="Phone *" value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
              <input className="input sm:col-span-2" placeholder="Address Line 1 *" value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
              <input className="input sm:col-span-2" placeholder="Address Line 2" value={address.line2}
                onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
              <input className="input" placeholder="City *" value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              <input className="input" placeholder="State *" value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              <input className="input" placeholder="Pincode *" value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
              <input className="input" placeholder="Country" value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })} />
            </div>
          </section>

          <section className="card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><CreditCard size={18} /> Payment Method</h3>
            <div className="space-y-2">
              {[
                { v: 'COD', l: 'Cash on Delivery' },
                { v: 'RAZORPAY', l: 'Online Payment (Razorpay)' },
                { v: 'MOCK', l: 'Test / Mock Payment' },
              ].map((p) => (
                <label key={p.v} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${paymentMethod === p.v ? 'border-brand-600 bg-brand-50 dark:bg-ink-800' : 'border-gray-200 dark:border-ink-700'}`}>
                  <input type="radio" name="pm" value={p.v} checked={paymentMethod === p.v}
                    onChange={() => setPaymentMethod(p.v)} className="accent-brand-600" />
                  <span className="text-sm">{p.l}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="card p-6 h-fit sticky top-20">
          <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 mb-3">
            {cart.items.map((it) => (
              <div key={`${it.product._id}-${it.size}`} className="flex gap-2 text-sm">
                <img src={it.product.images?.[0]} className="w-12 h-14 object-cover rounded" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="line-clamp-1">{it.product.name}</div>
                  <div className="text-xs text-gray-500">Qty: {it.qty} • ₹{it.product.price}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              placeholder="Coupon code" className="input" />
            <button type="button" onClick={applyCoupon} className="btn-outline !px-3 !py-2 text-sm">
              <Tag size={14} /> Apply
            </button>
          </div>
          {appliedCode && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 text-xs p-2 rounded mb-3">
              {appliedCode} applied — ₹{discount} off
            </div>
          )}

          <Row label="Subtotal" value={`₹${subtotal}`} />
          {discount > 0 && <Row label="Discount" value={`-₹${discount}`} green />}
          <Row label="Shipping" value={shipping === 0 ? 'FREE' : `₹${shipping}`} />
          <Row label="Tax (5%)" value={`₹${tax}`} />
          <div className="border-t border-gray-100 dark:border-ink-700 my-3" />
          <Row label="Total" value={`₹${total}`} bold />

          <button type="submit" disabled={placing} className="btn-primary w-full mt-4">
            {placing ? 'Placing...' : `Place Order — ₹${total}`}
          </button>
          <p className="text-xs text-gray-500 mt-3 text-center">By placing the order you agree to our terms.</p>
        </aside>
      </div>
    </form>
  );
}

const Row = ({ label, value, bold, green }) => (
  <div className={`flex justify-between text-sm py-1 ${bold ? 'font-bold text-base' : ''} ${green ? 'text-green-600' : ''}`}>
    <span>{label}</span><span>{value}</span>
  </div>
);
