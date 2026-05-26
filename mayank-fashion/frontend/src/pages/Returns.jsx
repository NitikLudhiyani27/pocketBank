import { Truck, RefreshCw, ShieldCheck } from 'lucide-react';

export default function Returns() {
  return (
    <div className="container-x py-12 max-w-4xl animate-fade-in">
      <h1 className="heading-display text-4xl font-bold mb-2">Return & Refund Policy</h1>
      <p className="text-gray-500 mb-8">Easy 7-day returns. No fuss, no hassle.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { i: <RefreshCw />, t: '7-Day Return', s: 'From date of delivery' },
          { i: <Truck />, t: 'Free Pickup', s: 'In most pincodes' },
          { i: <ShieldCheck />, t: 'Easy Refund', s: '5–7 business days' },
        ].map((p) => (
          <div key={p.t} className="card p-5 text-center">
            <div className="inline-flex bg-brand-50 dark:bg-ink-700 text-brand-600 p-3 rounded-2xl mb-3">{p.i}</div>
            <div className="font-semibold">{p.t}</div>
            <div className="text-xs text-gray-500 mt-1">{p.s}</div>
          </div>
        ))}
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="font-display text-xl font-semibold">Returnable items</h2>
          <p>
            Most products can be returned within 7 days of delivery if they are unworn, unwashed, and have all original tags
            attached. Innerwear, swimwear, beauty, and customized items are non-returnable for hygiene reasons.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">How to return</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Go to <b>My Orders</b> and select the item you want to return.</li>
            <li>Choose a reason and pickup date.</li>
            <li>Pack the item with original tags. Our courier will pick it up — no need to print a label.</li>
            <li>Once we receive and verify the item, your refund is initiated.</li>
          </ol>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">Refunds</h2>
          <p>
            Refunds are issued to your original payment method (UPI, card, wallet, or net banking) within 5–7 business days of
            pickup. For Cash on Delivery orders, refunds are sent to your bank account via NEFT.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">Exchanges</h2>
          <p>
            For size exchanges, we recommend placing a new order and returning the original item — this is the fastest way to
            get the right size, since the inventory clears immediately.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">Damaged or wrong item received?</h2>
          <p>
            We're sorry! Please contact <a className="text-brand-600" href="mailto:hello@mayankfashion.com">hello@mayankfashion.com</a>
            within 48 hours with a photo of the item. We'll arrange a free replacement or a full refund — your choice.
          </p>
        </section>
      </div>
    </div>
  );
}
