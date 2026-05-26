import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { data } = await api.post('/auth/newsletter', { email });
      toast.success(data.message || "You're subscribed!");
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not subscribe');
    } finally { setLoading(false); }
  };

  return (
    <footer className="mt-20 bg-gradient-to-br from-brand-50 to-white dark:from-ink-800 dark:to-ink-900 border-t border-gray-100 dark:border-ink-700">
      <div className="container-x py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white font-display font-bold">M</div>
            <span className="heading-display text-xl font-semibold">Mayank Fashion</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
            Premium clothing for modern women. Crafted with love, designed to make you feel beautiful every day.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="btn-ghost !p-2 rounded-full" aria-label="Instagram"><Instagram size={16} /></a>
            <a href="#" className="btn-ghost !p-2 rounded-full" aria-label="Facebook"><Facebook size={16} /></a>
            <a href="#" className="btn-ghost !p-2 rounded-full" aria-label="Twitter"><Twitter size={16} /></a>
            <a href="mailto:hello@mayankfashion.com" className="btn-ghost !p-2 rounded-full" aria-label="Email"><Mail size={16} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li><Link className="hover:text-brand-600" to="/shop/Kurti">Kurti</Link></li>
            <li><Link className="hover:text-brand-600" to="/shop/Sarees">Sarees</Link></li>
            <li><Link className="hover:text-brand-600" to="/shop/Western Dresses">Western</Link></li>
            <li><Link className="hover:text-brand-600" to="/shop/Party Wear">Party Wear</Link></li>
            <li><Link className="hover:text-brand-600" to="/shop">All Products</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Help</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li><Link className="hover:text-brand-600" to="/contact">Contact Us</Link></li>
            <li><Link className="hover:text-brand-600" to="/about">About</Link></li>
            <li><Link className="hover:text-brand-600" to="/faq">FAQ</Link></li>
            <li><Link className="hover:text-brand-600" to="/returns">Shipping & Returns</Link></li>
            <li><Link className="hover:text-brand-600" to="/privacy">Privacy Policy</Link></li>
            <li><Link className="hover:text-brand-600" to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Newsletter</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Get 10% off your first order with code <b className="text-brand-600">WELCOME10</b>
          </p>
          <form onSubmit={subscribe} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="Your email"
            />
            <button disabled={loading} className="btn-primary !px-4 !py-2 text-sm">
              {loading ? '...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-100 dark:border-ink-700">
        <div className="container-x py-4 text-xs text-center text-gray-500">
          © {new Date().getFullYear()} Mayank Fashion. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
