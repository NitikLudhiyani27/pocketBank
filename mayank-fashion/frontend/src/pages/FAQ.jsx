import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: 'How long does delivery take?',
    a: 'Most orders are delivered within 4–7 business days across India. Metro cities typically see delivery in 2–4 days. You can check delivery time for your pincode on any product page.',
  },
  {
    q: 'What is the return & refund policy?',
    a: 'We offer a 7-day return window from the date of delivery for unworn, unwashed items with all original tags. Refunds are issued to the original payment method within 5–7 business days of pickup.',
  },
  {
    q: 'How do I know my size?',
    a: "Each product page has a detailed size guide. If you're between sizes we generally recommend sizing up. Our customer care team is happy to help — just drop us a message on Contact.",
  },
  {
    q: 'Do you offer Cash on Delivery?',
    a: 'Yes, COD is available on most pincodes for orders up to ₹15,000. A small handling fee may apply.',
  },
  {
    q: 'Are payments secure?',
    a: 'Absolutely. We use Razorpay (PCI-DSS compliant) and never store your card details on our servers. All transactions are SSL-encrypted.',
  },
  {
    q: 'Can I cancel or modify an order?',
    a: 'You can cancel an order from the My Orders page until it has been shipped. Once shipped, the order can only be returned after delivery.',
  },
  {
    q: 'How do I use a coupon code?',
    a: 'Enter your coupon code at checkout in the "Coupon code" field and click Apply. Try WELCOME10 for 10% off your first order.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Currently we only ship within India. International shipping is coming soon — subscribe to our newsletter to be the first to know.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="container-x py-12 max-w-3xl animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="heading-display text-4xl font-bold">Frequently Asked Questions</h1>
        <p className="text-gray-500 mt-3">Everything you need to know about shopping with Mayank Fashion.</p>
      </div>
      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between text-left p-5 font-medium hover:bg-brand-50/50 dark:hover:bg-ink-700/50"
            >
              <span>{f.q}</span>
              {open === i ? <Minus size={18} className="text-brand-600 shrink-0" /> : <Plus size={18} className="shrink-0" />}
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
