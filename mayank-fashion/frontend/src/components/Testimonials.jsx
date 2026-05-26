import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const REVIEWS = [
  {
    name: 'Priya Sharma',
    city: 'Mumbai',
    avatar: 'https://i.pravatar.cc/120?img=47',
    rating: 5,
    text: "The fabric quality is incredible — feels premium for the price. My festive kurti got so many compliments at Diwali!",
  },
  {
    name: 'Aanya Verma',
    city: 'Bangalore',
    avatar: 'https://i.pravatar.cc/120?img=44',
    rating: 5,
    text: "I've ordered four times now and every piece has been on point. The fit is true to size and delivery is always fast.",
  },
  {
    name: 'Riya Patel',
    city: 'Ahmedabad',
    avatar: 'https://i.pravatar.cc/120?img=49',
    rating: 5,
    text: "Loved the co-ord set! Beautiful packaging, soft fabric, and the colours are exactly like the photos.",
  },
  {
    name: 'Neha Kapoor',
    city: 'Delhi',
    avatar: 'https://i.pravatar.cc/120?img=45',
    rating: 4,
    text: 'Very happy with the saree I ordered for my sister-in-law. Stitching is neat and the fall is perfect.',
  },
];

export default function Testimonials() {
  return (
    <section className="container-x py-14">
      <div className="text-center mb-10">
        <div className="text-brand-600 font-semibold text-sm">LOVED BY 50,000+ WOMEN</div>
        <h2 className="heading-display text-3xl font-bold mt-2">What Our Customers Say</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {REVIEWS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="card p-6 relative"
          >
            <Quote size={28} className="absolute top-4 right-4 text-brand-100 dark:text-ink-700" />
            <div className="flex">
              {Array.from({ length: 5 }).map((_, n) => (
                <Star key={n} size={14}
                  className={n < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">"{r.text}"</p>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-ink-700">
              <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-medium text-sm">{r.name}</div>
                <div className="text-xs text-gray-500">{r.city}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
