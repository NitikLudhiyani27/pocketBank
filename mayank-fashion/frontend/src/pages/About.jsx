import { motion } from 'framer-motion';
import { Heart, Sparkles, Award, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="animate-fade-in">
      <section className="container-x py-16 grid lg:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="text-brand-600 font-semibold mb-2">Our Story</div>
          <h1 className="heading-display text-4xl lg:text-5xl font-bold leading-tight">
            Designed to make you feel <em className="text-brand-600">extraordinary</em>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-5">
            Mayank Fashion was founded with a simple belief — every woman deserves clothes
            that celebrate her individuality. From traditional ethnic wear to contemporary
            western styles, we curate pieces that empower confidence and embrace femininity.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-3">
            Our team of designers handpicks every fabric, every detail, ensuring quality
            you can feel and styles you'll love. Join thousands of happy customers who
            call Mayank Fashion their go-to destination.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="aspect-[4/5] rounded-3xl overflow-hidden shadow-glow">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000"
            alt="" className="w-full h-full object-cover" />
        </motion.div>
      </section>

      <section className="container-x py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { i: <Heart />, t: 'Passion', s: 'Crafted with love & care' },
          { i: <Sparkles />, t: 'Premium', s: 'Highest quality fabrics' },
          { i: <Award />, t: 'Trusted', s: 'By 50,000+ customers' },
          { i: <Globe />, t: 'Global', s: 'Shipping pan-India' },
        ].map((v) => (
          <div key={v.t} className="card p-6 text-center">
            <div className="inline-flex bg-brand-50 dark:bg-ink-700 text-brand-600 p-3 rounded-2xl mb-3">{v.i}</div>
            <div className="font-semibold">{v.t}</div>
            <div className="text-sm text-gray-500 mt-1">{v.s}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
