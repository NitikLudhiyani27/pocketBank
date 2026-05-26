import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import FlashSale from '../components/FlashSale';
import Testimonials from '../components/Testimonials';
import InstagramGallery from '../components/InstagramGallery';
import RecentlyViewed from '../components/RecentlyViewed';

const categoryShowcase = [
  { name: 'Kurti', img: 'https://picsum.photos/seed/kurti/600/700' },
  { name: 'Western Dresses', img: 'https://picsum.photos/seed/western/600/700' },
  { name: 'Sarees', img: 'https://picsum.photos/seed/saree/600/700' },
  { name: 'Party Wear', img: 'https://picsum.photos/seed/party/600/700' },
  { name: 'Co-ord Sets', img: 'https://picsum.photos/seed/coord/600/700' },
  { name: 'Palazzo Sets', img: 'https://picsum.photos/seed/palazzo/600/700' },
];

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    api.get('/products?trending=true&limit=8').then(({ data }) => setTrending(data.items || []));
    api.get('/products?featured=true&limit=8').then(({ data }) => setFeatured(data.items || []));
    api.get('/products?sort=newest&limit=8').then(({ data }) => setNewArrivals(data.items || []));
    api.get('/products?sort=popular&limit=8').then(({ data }) => setBestSellers(data.items || []));
  }, []);

  return (
    <div className="animate-fade-in">
      <HeroSlider />

      {/* PERKS */}
      <section className="container-x grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
        {[
          { i: <Truck />, t: 'Free Shipping', s: 'On orders over ₹999' },
          { i: <ShieldCheck />, t: 'Secure Payment', s: '100% safe checkout' },
          { i: <RefreshCw />, t: 'Easy Returns', s: '7-day return policy' },
          { i: <Sparkles />, t: 'New Drops', s: 'Every week' },
        ].map((p) => (
          <div key={p.t} className="card p-4 flex items-center gap-3">
            <div className="text-brand-600 bg-brand-50 dark:bg-ink-700 p-2 rounded-xl">{p.i}</div>
            <div>
              <div className="font-semibold text-sm">{p.t}</div>
              <div className="text-xs text-gray-500">{p.s}</div>
            </div>
          </div>
        ))}
      </section>

      {/* CATEGORIES */}
      <section className="container-x py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="heading-display text-3xl font-bold">Shop by Category</h2>
            <p className="text-gray-500 mt-1">Find your style</p>
          </div>
          <Link to="/shop" className="text-brand-600 text-sm font-medium hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryShowcase.map((c, i) => (
            <Link key={c.name} to={`/shop/${encodeURIComponent(c.name)}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-soft">
              <motion.img
                initial={{ scale: 1.1, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                src={c.img} alt={c.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <div className="font-semibold text-sm sm:text-base">{c.name}</div>
                <div className="text-xs opacity-80">Shop now →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="container-x py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="heading-display text-3xl font-bold">Trending Now</h2>
            <p className="text-gray-500 mt-1">What everyone is loving</p>
          </div>
          <Link to="/shop" className="text-brand-600 text-sm font-medium hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trending.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      </section>

      {/* FLASH SALE with countdown */}
      <FlashSale />

      {/* NEW ARRIVALS */}
      <section className="container-x py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="heading-display text-3xl font-bold">New Arrivals</h2>
            <p className="text-gray-500 mt-1">Fresh styles, just dropped</p>
          </div>
          <Link to="/shop?sort=newest" className="text-brand-600 text-sm font-medium hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {newArrivals.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      </section>

      {/* OFFER BANNER */}
      <section className="container-x py-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 p-10 lg:p-16 text-white">
          <div className="relative z-10 max-w-xl">
            <div className="text-sm font-semibold uppercase tracking-wider opacity-90">Limited Time</div>
            <h3 className="heading-display text-3xl lg:text-4xl font-bold mt-2">Up to 50% Off on Ethnic Wear</h3>
            <p className="mt-3 opacity-90">Shop the festive edit. Use code <b>MAYANK20</b> for extra 20% off.</p>
            <Link to="/shop/Ethnic Wear" className="mt-6 inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-6 py-3 rounded-full hover:scale-105 transition">
              Shop the Edit <ArrowRight size={16} />
            </Link>
          </div>
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-10 top-6 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="container-x py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="heading-display text-3xl font-bold">Best Sellers</h2>
            <p className="text-gray-500 mt-1">Customer favourites</p>
          </div>
          <Link to="/shop?sort=popular" className="text-brand-600 text-sm font-medium hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bestSellers.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-x py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="heading-display text-3xl font-bold">Featured Picks</h2>
            <p className="text-gray-500 mt-1">Hand-curated by our stylists</p>
          </div>
          <Link to="/shop" className="text-brand-600 text-sm font-medium hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      </section>

      {/* RECENTLY VIEWED (renders only if there's history) */}
      <RecentlyViewed />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* INSTAGRAM GALLERY */}
      <InstagramGallery />
    </div>
  );
}
