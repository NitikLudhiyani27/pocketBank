import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Truck, RefreshCw, ShieldCheck, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import PincodeChecker from '../components/PincodeChecker';
import RecentlyViewed from '../components/RecentlyViewed';
import useRecentlyViewed from '../hooks/useRecentlyViewed';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function Product() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { user } = useAuth();
  const { push: pushRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    setLoading(true);
    setImgIdx(0); setSize(''); setColor(''); setQty(1);
    api.get(`/products/${id}`).then(({ data }) => {
      setData(data);
      setSize(data.product.sizes?.[0] || '');
      setColor(data.product.colors?.[0] || '');
      // Track view in localStorage so the Recently Viewed rail can render it.
      if (data.product?._id) pushRecentlyViewed(data.product._id);
    }).finally(() => setLoading(false));

    api.get(`/products/${id}/recommendations`).then(({ data }) => setRecommendations(data.items || []));
    api.get(`/reviews/product/${id}`).then(({ data }) => setReviews(data.reviews || []));
  }, [id]);

  if (loading || !data) return <div className="container-x py-20 text-center">Loading...</div>;
  const { product } = data;

  const onAdd = async () => {
    if (product.sizes?.length > 0 && !size) return toast.error('Please select a size');
    await add(product._id, qty, size, color);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to review');
    const formData = new FormData(e.target);
    try {
      await api.post('/reviews', {
        productId: product._id,
        rating: Number(formData.get('rating')),
        comment: formData.get('comment'),
      });
      toast.success('Review submitted');
      const { data } = await api.get(`/reviews/product/${id}`);
      setReviews(data.reviews);
      e.target.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="container-x py-8 animate-fade-in">
      <nav className="text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-brand-600">Home</Link> /{' '}
        <Link to={`/shop/${product.category}`} className="hover:text-brand-600">{product.category}</Link> /{' '}
        <span>{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* IMAGES */}
        <div>
          <motion.div key={imgIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="aspect-[3/4] bg-gray-100 dark:bg-ink-800 rounded-2xl overflow-hidden">
            <img src={product.images?.[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {(product.images || []).map((src, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                className={`aspect-[3/4] rounded-xl overflow-hidden border-2 ${imgIdx === i ? 'border-brand-600' : 'border-transparent'}`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div>
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-brand-50 dark:bg-ink-800 text-brand-600 px-2 py-1 rounded-full">{product.category}</span>
            {product.trending && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Trending</span>}
          </div>
          <h1 className="heading-display text-3xl font-bold mt-3">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className={s <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>

          <div className="flex items-end gap-3 mt-5">
            <span className="text-3xl font-bold">₹{product.price}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>
                <span className="text-green-600 font-semibold">{product.discount}% off</span>
              </>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1">Inclusive of all taxes</div>

          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <div className="font-semibold mb-2 text-sm">Size</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`min-w-12 h-10 px-3 rounded-lg border text-sm font-medium ${size === s ? 'border-brand-600 bg-brand-50 dark:bg-ink-700 text-brand-600' : 'border-gray-200 dark:border-ink-700'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="mt-5">
              <div className="font-semibold mb-2 text-sm">Color: <span className="font-normal text-gray-500">{color}</span></div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`px-3 py-1.5 rounded-full border text-xs ${color === c ? 'border-brand-600 bg-brand-50 dark:bg-ink-700 text-brand-600' : 'border-gray-200 dark:border-ink-700'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-1 border border-gray-200 dark:border-ink-700 rounded-full">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2"><Minus size={14} /></button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-2"><Plus size={14} /></button>
            </div>
            <span className="text-xs text-gray-500">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button onClick={onAdd} disabled={product.stock <= 0} className="btn-primary flex-1">
              <ShoppingBag size={18} /> Add to Cart
            </button>
            <button onClick={() => toggle(product._id)} className="btn-outline">
              <Heart size={18} className={has(product._id) ? 'fill-brand-600' : ''} />
              {has(product._id) ? 'Saved' : 'Wishlist'}
            </button>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3 text-xs">
            {[
              { i: <Truck size={16} />, t: 'Free Shipping ₹999+' },
              { i: <RefreshCw size={16} />, t: '7-Day Returns' },
              { i: <ShieldCheck size={16} />, t: 'Secure Payment' },
            ].map((p) => (
              <div key={p.t} className="card p-3 flex flex-col items-center text-center gap-1">
                <span className="text-brand-600">{p.i}</span><span>{p.t}</span>
              </div>
            ))}
          </div>

          <PincodeChecker />

          <div className="mt-8 prose prose-sm dark:prose-invert">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{product.description}</p>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <section className="mt-16">
        <h2 className="heading-display text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div className="space-y-4">
            {reviews.length === 0 && <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>}
            {reviews.map((r) => (
              <div key={r._id} className="card p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-medium text-sm">{r.name || 'Anonymous'}</div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} className={s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{r.comment}</p>
              </div>
            ))}
          </div>
          {user && (
            <form onSubmit={submitReview} className="card p-5 h-fit">
              <h3 className="font-semibold mb-3">Write a Review</h3>
              <select name="rating" defaultValue="5" className="input mb-3">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
              </select>
              <textarea name="comment" placeholder="Share your experience..." rows="4" className="input mb-3" />
              <button className="btn-primary w-full">Submit Review</button>
            </form>
          )}
        </div>
      </section>

      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <section className="mt-16">
          <h2 className="heading-display text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendations.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* RECENTLY VIEWED — exclude current product */}
      <RecentlyViewed excludeId={product._id} />
    </div>
  );
}
