import { Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const POSTS = [
  'https://picsum.photos/seed/insta-mf-1/600/600',
  'https://picsum.photos/seed/insta-mf-2/600/600',
  'https://picsum.photos/seed/insta-mf-3/600/600',
  'https://picsum.photos/seed/insta-mf-4/600/600',
  'https://picsum.photos/seed/insta-mf-5/600/600',
  'https://picsum.photos/seed/insta-mf-6/600/600',
];

export default function InstagramGallery() {
  return (
    <section className="container-x py-14">
      <div className="text-center mb-8">
        <div className="text-brand-600 font-semibold text-sm">FOLLOW US</div>
        <h2 className="heading-display text-3xl font-bold mt-2">@mayankfashion on Instagram</h2>
        <p className="text-gray-500 mt-2 text-sm">Tag us with #MayankFashion to be featured</p>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {POSTS.map((src, i) => (
          <motion.a
            key={i}
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="relative aspect-square overflow-hidden rounded-xl group"
          >
            <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
              <Instagram size={28} className="text-white opacity-0 group-hover:opacity-100 transition" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
