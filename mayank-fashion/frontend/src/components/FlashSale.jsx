import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import api from '../api/client';
import ProductCard from './ProductCard';

// Returns hours/min/sec until midnight tonight, refreshing every second.
function useCountdownToMidnight() {
  const [t, setT] = useState(() => calc());
  function calc() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const ms = Math.max(0, end - now);
    return {
      h: Math.floor(ms / 3_600_000),
      m: Math.floor((ms % 3_600_000) / 60_000),
      s: Math.floor((ms % 60_000) / 1000),
    };
  }
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const Cell = ({ n, l }) => (
  <div className="bg-white/15 backdrop-blur rounded-lg px-3 py-2 text-center min-w-14">
    <div className="font-bold text-xl tabular-nums">{String(n).padStart(2, '0')}</div>
    <div className="text-[10px] uppercase tracking-wider opacity-80">{l}</div>
  </div>
);

export default function FlashSale() {
  const { h, m, s } = useCountdownToMidnight();
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Use trending as a stand-in for flash-sale picks; sort by highest discount.
    api.get('/products?trending=true&limit=4').then(({ data }) => {
      const sorted = (data.items || [])
        .slice()
        .sort((a, b) => (b.discount || 0) - (a.discount || 0));
      setItems(sorted);
    });
  }, []);

  return (
    <section className="container-x py-12">
      <div className="rounded-3xl bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 text-white p-6 lg:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Zap size={14} /> Flash Sale
            </div>
            <h2 className="heading-display text-2xl lg:text-3xl font-bold mt-2">Up to 60% off — ends today</h2>
          </div>
          <div className="flex items-end gap-2">
            <Cell n={h} l="Hrs" />
            <span className="text-2xl font-bold">:</span>
            <Cell n={m} l="Min" />
            <span className="text-2xl font-bold">:</span>
            <Cell n={s} l="Sec" />
          </div>
        </div>

        {items.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {items.map((p, i) => (
              <div key={p._id} className="bg-white text-ink-900 rounded-2xl overflow-hidden">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-6 py-3 rounded-full hover:scale-105 transition">
            Shop Flash Sale <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
