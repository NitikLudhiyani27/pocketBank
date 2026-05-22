import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ products: [] });

  const refresh = async () => {
    if (!user) { setWishlist({ products: [] }); return; }
    try {
      const { data } = await api.get('/wishlist');
      setWishlist(data.wishlist || { products: [] });
    } catch { /* noop */ }
  };

  useEffect(() => { refresh(); }, [user]);

  const toggle = async (productId) => {
    if (!user) { toast.error('Please login to use wishlist'); return; }
    const { data } = await api.post('/wishlist/toggle', { productId });
    setWishlist(data.wishlist);
    const has = data.wishlist.products.some((p) => (p._id || p) === productId);
    toast.success(has ? 'Added to wishlist' : 'Removed from wishlist');
  };

  const has = (productId) =>
    (wishlist.products || []).some((p) => (p._id || p) === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, has, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
}
