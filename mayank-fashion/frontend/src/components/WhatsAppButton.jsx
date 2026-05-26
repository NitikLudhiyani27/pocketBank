import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

const WHATSAPP_NUMBER = '919876543210'; // Country code + number, no '+' or spaces.
const PRESETS = [
  'Hi! I have a question about an order.',
  'Help me find the right size.',
  'Is COD available on my pincode?',
  'I need help with a return.',
];

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  const send = (text) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-5 z-40 w-72 card p-4 shadow-glow border border-gray-100 dark:border-ink-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-sm">Chat with us</div>
                <div className="text-xs text-gray-500">We typically reply in minutes</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="w-full text-left text-sm px-3 py-2 rounded-lg bg-brand-50 dark:bg-ink-700 hover:bg-brand-100 dark:hover:bg-ink-600 transition"
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => send('Hi Mayank Fashion! I need help.')}
              className="btn-primary w-full mt-3 !py-2 text-sm"
            >
              Open WhatsApp
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-glow hover:scale-110 transition-transform"
      >
        <MessageCircle size={26} />
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full">
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping" />
        </span>
      </button>
    </>
  );
}
