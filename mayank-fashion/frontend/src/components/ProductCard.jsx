import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, index = 0 }) {
  const { has, toggle } = useWishlist();
  const inWishlist = has(product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4) }}
      className="group card overflow-hidden hover:shadow-glow transition-all"
    >
      <Link to={`/product/${product._id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-ink-700">
        <img
          src={product.images?.[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-brand-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {product.discount}% OFF
          </span>
        )}
        {product.trending && (
          <span className="absolute top-3 right-12 bg-black/80 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            TRENDING
          </span>
        )}
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); toggle(product._id); }}
        className="absolute top-3 right-3 bg-white/90 dark:bg-ink-900/90 rounded-full p-2 shadow hover:scale-110 transition"
        aria-label="Wishlist"
      >
        <Heart size={16} className={inWishlist ? 'fill-brand-600 text-brand-600' : 'text-gray-700 dark:text-gray-300'} />
      </button>
      <div className="p-3">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-medium line-clamp-1 group-hover:text-brand-600">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span>{product.rating?.toFixed?.(1) || '—'}</span>
          <span>({product.numReviews || 0})</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-semibold">₹{product.price}</span>
          {product.mrp > product.price && (
            <>
              <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
              <span className="text-xs text-green-600 font-medium">-{product.discount}%</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
