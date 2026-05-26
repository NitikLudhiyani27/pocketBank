import { useEffect, useState } from 'react';
import api from '../api/client';
import ProductCard from './ProductCard';
import useRecentlyViewed from '../hooks/useRecentlyViewed';

/**
 * Renders a "Recently Viewed" rail using IDs persisted in localStorage.
 * Optionally exclude a product (e.g. the current product detail page) via `excludeId`.
 * Renders nothing if there are no items to show.
 */
export default function RecentlyViewed({ excludeId, title = 'Recently Viewed' }) {
  const { ids } = useRecentlyViewed();
  const [items, setItems] = useState([]);

  const list = ids.filter((id) => id !== excludeId).slice(0, 8);

  useEffect(() => {
    if (list.length === 0) { setItems([]); return; }
    let cancelled = false;
    Promise.all(
      list.map((id) =>
        api.get(`/products/${id}`).then((r) => r.data.product).catch(() => null)
      )
    ).then((res) => {
      if (!cancelled) setItems(res.filter(Boolean));
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.join(',')]);

  if (items.length === 0) return null;

  return (
    <section className="container-x py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="heading-display text-2xl font-bold">{title}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
      </div>
    </section>
  );
}
