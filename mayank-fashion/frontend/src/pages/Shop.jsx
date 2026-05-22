import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import ProductCard from '../components/ProductCard';

const SORTS = [
  { v: 'newest', l: 'Newest' },
  { v: 'priceAsc', l: 'Price: Low to High' },
  { v: 'priceDesc', l: 'Price: High to Low' },
  { v: 'ratingDesc', l: 'Top Rated' },
  { v: 'popular', l: 'Most Popular' },
];

export default function Shop() {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState(params.get('sort') || 'newest');
  const [maxPrice, setMaxPrice] = useState(Number(params.get('maxPrice')) || 5000);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get('/products/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const search = new URLSearchParams();
    if (category) search.set('category', category);
    if (q) search.set('q', q);
    if (sort) search.set('sort', sort);
    if (maxPrice) search.set('maxPrice', maxPrice);
    search.set('page', page);
    search.set('limit', 12);
    api.get(`/products?${search}`)
      .then(({ data }) => { setItems(data.items); setTotal(data.total); })
      .finally(() => setLoading(false));
  }, [category, q, sort, maxPrice, page]);

  const title = category ? category : q ? `Results for "${q}"` : 'All Products';

  return (
    <div className="container-x py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="heading-display text-3xl font-bold">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{loading ? 'Loading...' : `${total} products`}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilterOpen((v) => !v)} className="btn-outline md:hidden !py-2 !px-4">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input !py-2 max-w-xs">
            {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-[260px_1fr] gap-6">
        {/* FILTERS */}
        <aside className="hidden md:block space-y-6 sticky top-20 self-start">
          <FilterPanel categories={categories} maxPrice={maxPrice} setMaxPrice={setMaxPrice} />
        </aside>

        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 md:hidden"
              onClick={() => setFilterOpen(false)}
            >
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween' }}
                className="bg-white dark:bg-ink-900 h-full w-80 p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="heading-display text-lg font-semibold">Filters</h3>
                  <button onClick={() => setFilterOpen(false)}><X size={18} /></button>
                </div>
                <FilterPanel categories={categories} maxPrice={maxPrice} setMaxPrice={setMaxPrice} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PRODUCTS */}
        <div>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="aspect-[3/4] skeleton" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 skeleton" /><div className="h-3 w-1/2 skeleton" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function FilterPanel({ categories, maxPrice, setMaxPrice }) {
    return (
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold mb-3">Categories</h4>
          <div className="flex flex-wrap gap-2">
            <a href="/shop" className={`text-xs px-3 py-1.5 rounded-full border ${!category ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 dark:border-ink-700'}`}>
              All
            </a>
            {categories.map((c) => (
              <a key={c} href={`/shop/${encodeURIComponent(c)}`}
                className={`text-xs px-3 py-1.5 rounded-full border ${category === c ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 dark:border-ink-700'}`}>
                {c}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Max Price: ₹{maxPrice}</h4>
          <input type="range" min="100" max="10000" step="100" value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-brand-600" />
        </div>
      </div>
    );
  }
}
