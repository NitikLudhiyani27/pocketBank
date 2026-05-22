import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';

const heroImages = [
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200',
];

const categoryShowcase = [
  { name: 'Kurti', img: 'https://picsum.photos/seed/kurti/600/700' },
  { name: 'Western Dresses', img: 'https://picsum.photos/seed/western/600/700' },
  { name: 'Sarees', img: 'https://picsum.photos/seed/saree/600/700' },
  { name: 'Party Wear', img: 'https://picsum.photos/seed/party/600/700' },
  { name: 'Co-ord Sets', img: 'https://picsum.photos/seed/coord/600/700' },
  { name: 'Footwear', img: 'https://picsum.photos/seed/foot/600/700' },
];

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/products?trending=true&limit=8').then(({ data }) => setTrending(data.items || []));
    api.get('/products?featured=true&limit=8').then(({ data }) => setFeatured(data.items || []));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-x grid lg:grid-cols-2 gap-10 items-center py-16 lg:py-24">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-ink-800 text-brand-600 px-4 py-1.5 rounded-full text-sm font-medium mb-5">
              <Sparkles size={14} /> New Summer Collection 2026
            </div>
            <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Wear Your <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">Confidence</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-5 max-w-md">
              Premium fashion for the modern Indian woman. Explore curated styles
              from ethnic elegance to western chic.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link to="/shop" className="btn-primary">Shop Now <ArrowRight size={16} /></Link>
              <Link to="/shop/Ethnic Wear" className="btn-outline">Explore Ethnic</Link>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-10 max-w-md">
              {[
                { v: '500+', l: 'Styles' },
                { v: '50K+', l: 'Happy Customers' },
                { v: '4.8★', l: 'Avg Rating' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="heading-display text-2xl font-bold text-brand-600">{s.v}</div>
                  <div className="text-xs text-gray-500">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-glow">
              <img src={heroImages[0]} alt="hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/30 to-transparent" />
            </div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -bottom-6 -left-6 card p-4 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="bg-brand-100 dark:bg-ink-700 p-2 rounded-xl"><Sparkles size={18} className="text-brand-600" /></div>
                <div>
                  <div className="text-xs text-gray-500">Use code</div>
                  <div className="font-bold text-brand-600">WELCOME10</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

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
    </div>
  );
}
