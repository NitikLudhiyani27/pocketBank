import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, User, Sun, Moon, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/shop/Ethnic Wear', label: 'Ethnic' },
  { to: '/shop/Western Dresses', label: 'Western' },
  { to: '/shop/Party Wear', label: 'Party' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { wishlist } = useWishlist();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [menu, setMenu] = useState(false);
  const searchBoxRef = useRef(null);
  const nav = useNavigate();

  // Debounced live search suggestions
  useEffect(() => {
    if (!search.trim() || search.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(() => {
      api.get(`/products?q=${encodeURIComponent(search.trim())}&limit=6`)
        .then(({ data }) => setSuggestions(data.items || []))
        .catch(() => setSuggestions([]));
    }, 200);
    return () => clearTimeout(t);
  }, [search]);

  // Close suggestions on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      nav(`/shop?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setShowSuggest(false);
      setOpen(false);
    }
  };

  const goToSuggestion = (p) => {
    nav(`/product/${p._id}`);
    setSearch('');
    setShowSuggest(false);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-ink-900/80 border-b border-gray-100 dark:border-ink-700">
      <div className="container-x flex items-center gap-4 h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white font-display font-bold">M</div>
          <span className="heading-display text-xl font-semibold tracking-wide">Mayank Fashion</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-6">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-lg ${
                  isActive ? 'text-brand-600' : 'text-ink-900/80 dark:text-white/80 hover:text-brand-600'
                }`
              }
              end
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <form ref={searchBoxRef} onSubmit={onSearch} className="ml-auto hidden md:flex items-center relative w-72">
          <Search size={16} className="absolute left-3 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowSuggest(true)}
            placeholder="Search dresses, sarees, kurtis..."
            className="input pl-9"
          />
          <AnimatePresence>
            {showSuggest && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 right-0 mt-2 card border border-gray-100 dark:border-ink-700 max-h-96 overflow-y-auto z-50"
              >
                {suggestions.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => goToSuggestion(p)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-brand-50 dark:hover:bg-ink-700 text-left"
                  >
                    <img src={p.images?.[0]} alt="" className="w-10 h-12 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm line-clamp-1">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.category} · ₹{p.price}</div>
                    </div>
                  </button>
                ))}
                <button
                  type="submit"
                  className="w-full p-2 text-sm text-brand-600 font-medium hover:bg-brand-50 dark:hover:bg-ink-700 border-t border-gray-100 dark:border-ink-700"
                >
                  See all results for "{search.trim()}" →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="ml-auto md:ml-2 flex items-center gap-1">
          <button onClick={toggle} className="btn-ghost !px-2 !py-2 rounded-full" aria-label="Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/wishlist" className="btn-ghost !px-2 !py-2 rounded-full relative" aria-label="Wishlist">
            <Heart size={18} />
            {wishlist?.products?.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[10px] rounded-full h-4 min-w-4 px-1 grid place-items-center">
                {wishlist.products.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="btn-ghost !px-2 !py-2 rounded-full relative" aria-label="Cart">
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[10px] rounded-full h-4 min-w-4 px-1 grid place-items-center">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button onClick={() => setMenu((m) => !m)} className="btn-ghost !px-2 !py-2 rounded-full" aria-label="Account">
                <User size={18} />
              </button>
              <AnimatePresence>
                {menu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-56 card p-2 border border-gray-100 dark:border-ink-700"
                    onMouseLeave={() => setMenu(false)}
                  >
                    <div className="px-3 py-2 text-sm">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                    <Link to="/profile" onClick={() => setMenu(false)} className="block px-3 py-2 text-sm rounded-lg hover:bg-brand-50 dark:hover:bg-ink-700">Profile</Link>
                    <Link to="/orders" onClick={() => setMenu(false)} className="block px-3 py-2 text-sm rounded-lg hover:bg-brand-50 dark:hover:bg-ink-700">My Orders</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMenu(false)} className="px-3 py-2 text-sm rounded-lg hover:bg-brand-50 dark:hover:bg-ink-700 flex items-center gap-2">
                        <LayoutDashboard size={14} /> Admin
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setMenu(false); }}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-brand-50 dark:hover:bg-ink-700 flex items-center gap-2 text-red-600"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:inline-flex btn-primary !py-1.5 !px-4 text-sm">Login</Link>
          )}

          <button onClick={() => setOpen(true)} className="lg:hidden btn-ghost !px-2 !py-2" aria-label="Menu">
            <Menu size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-ink-900 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="heading-display text-lg">Menu</span>
                <button onClick={() => setOpen(false)} className="btn-ghost !px-2 !py-2"><X size={18} /></button>
              </div>
              <form onSubmit={onSearch} className="mb-4">
                <input
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..." className="input"
                />
              </form>
              <div className="flex flex-col gap-1">
                {navItems.map((n) => (
                  <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)}
                    className="px-3 py-3 rounded-lg hover:bg-brand-50 dark:hover:bg-ink-800 font-medium">
                    {n.label}
                  </NavLink>
                ))}
                {!user && (
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-primary mt-4">Login</Link>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
