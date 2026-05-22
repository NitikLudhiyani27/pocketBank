import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!user) { setCart({ items: [] }); return; }
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setCart(data.cart || { items: [] });
    } finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, [user]);

  const add = async (productId, qty = 1, size, color) => {
    if (!user) { toast.error('Please login to add to cart'); return false; }
    const { data } = await api.post('/cart/add', { productId, qty, size, color });
    setCart(data.cart);
    toast.success('Added to cart');
    return true;
  };

  const update = async (productId, size, color, qty) => {
    const { data } = await api.put('/cart/update', { productId, size, color, qty });
    setCart(data.cart);
  };

  const remove = async (productId, size, color) => {
    const { data } = await api.post('/cart/remove', { productId, size, color });
    setCart(data.cart);
  };

  const clear = async () => {
    const { data } = await api.delete('/cart/clear');
    setCart(data.cart || { items: [] });
  };

  const count = (cart.items || []).reduce((s, i) => s + i.qty, 0);
  const subtotal = (cart.items || []).reduce((s, i) => s + (i.product?.price || 0) * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, loading, count, subtotal, add, update, remove, clear, refresh }}>
      {children}
    </CartContext.Provider>
  );
}
