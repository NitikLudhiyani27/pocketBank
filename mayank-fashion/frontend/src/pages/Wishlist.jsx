import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { user } = useAuth();
  const { wishlist } = useWishlist();

  if (!user) {
    return (
      <div className="container-x py-20 text-center">
        <Heart size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="heading-display text-2xl font-bold mb-2">Login to view your wishlist</h2>
        <Link to="/login" className="btn-primary mt-4 inline-flex">Login</Link>
      </div>
    );
  }

  if (!wishlist.products?.length) {
    return (
      <div className="container-x py-20 text-center">
        <Heart size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="heading-display text-2xl font-bold mb-2">Your wishlist is empty</h2>
        <Link to="/shop" className="btn-primary mt-4 inline-flex">Discover Products</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-8 animate-fade-in">
      <h1 className="heading-display text-3xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlist.products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
      </div>
    </div>
  );
}
