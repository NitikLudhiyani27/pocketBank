import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600',
    eyebrow: 'New Summer Collection 2026',
    title: ['Wear Your', 'Confidence'],
    sub: 'Premium fashion crafted for the modern Indian woman.',
    cta: { label: 'Shop Now', to: '/shop' },
    cta2: { label: 'Explore Ethnic', to: '/shop/Ethnic Wear' },
  },
  {
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600',
    eyebrow: 'Ethnic Edit',
    title: ['Festive Drops', 'Just Landed'],
    sub: 'Lehengas, sarees, and palazzo sets for every celebration.',
    cta: { label: 'Shop Festive', to: '/shop/Ethnic Wear' },
    cta2: { label: 'Browse Sarees', to: '/shop/Sarees' },
  },
  {
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600',
    eyebrow: 'Up to 50% Off',
    title: ['Style That', 'Speaks'],
    sub: 'Western chic, party wear, and casual essentials curated by our stylists.',
    cta: { label: 'Shop Sale', to: '/shop' },
    cta2: { label: 'Western Edit', to: '/shop/Western Dresses' },
  },
];

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const next = () => setI((p) => (p + 1) % SLIDES.length);
  const prev = () => setI((p) => (p - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, []);

  const s = SLIDES[i];

  return (
    <section className="relative overflow-hidden">
      <div className="container-x grid lg:grid-cols-2 gap-10 items-center py-12 lg:py-20">
        <div className="relative min-h-[280px] lg:min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-ink-800 text-brand-600 px-4 py-1.5 rounded-full text-sm font-medium mb-5">
                <Sparkles size={14} /> {s.eyebrow}
              </div>
              <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                {s.title[0]}{' '}
                <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                  {s.title[1]}
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-5 max-w-md">{s.sub}</p>
              <div className="flex flex-wrap gap-3 mt-7">
                <Link to={s.cta.to} className="btn-primary">{s.cta.label} <ArrowRight size={16} /></Link>
                <Link to={s.cta2.to} className="btn-outline">{s.cta2.label}</Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-4 mt-10 max-w-md">
            {[
              { v: '500+', l: 'Styles' },
              { v: '50K+', l: 'Happy Customers' },
              { v: '4.8★', l: 'Avg Rating' },
            ].map((st) => (
              <div key={st.l}>
                <div className="heading-display text-2xl font-bold text-brand-600">{st.v}</div>
                <div className="text-xs text-gray-500">{st.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-glow">
            <AnimatePresence mode="wait">
              <motion.img
                key={s.img}
                src={s.img}
                alt=""
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/30 to-transparent pointer-events-none" />
          </div>

          {/* Slider controls */}
          <button onClick={prev}
            className="absolute top-1/2 -translate-y-1/2 left-3 bg-white/90 dark:bg-ink-900/80 backdrop-blur rounded-full p-2 shadow hover:scale-110 transition"
            aria-label="Previous">
            <ChevronLeft size={18} />
          </button>
          <button onClick={next}
            className="absolute top-1/2 -translate-y-1/2 right-3 bg-white/90 dark:bg-ink-900/80 backdrop-blur rounded-full p-2 shadow hover:scale-110 transition"
            aria-label="Next">
            <ChevronRight size={18} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {SLIDES.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-8 bg-white' : 'w-1.5 bg-white/60'}`}
                aria-label={`Slide ${idx + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
