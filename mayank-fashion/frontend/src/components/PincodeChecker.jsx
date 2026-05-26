import { useState } from 'react';
import { MapPin, CheckCircle2, XCircle } from 'lucide-react';

// Simple deterministic delivery estimator. In production this would hit a serviceability API
// (Shiprocket, Delhivery, etc.). Pincodes ending in 0 are simulated as "unserviceable"
// so the negative state can be demonstrated.
function estimateDelivery(pin) {
  const cleaned = (pin || '').replace(/\D/g, '');
  if (cleaned.length !== 6) return { ok: false, reason: 'Enter a valid 6-digit pincode' };
  if (cleaned.endsWith('0')) return { ok: false, reason: 'We do not deliver here yet' };

  // Simulated metro pincodes vs everywhere else.
  const metro = /^(110|400|560|600|700|500|380|122|201|411)/.test(cleaned);
  const days = metro ? '2–3' : '4–7';
  const cod = !cleaned.endsWith('5');

  return {
    ok: true,
    days,
    cod,
    free: true,
  };
}

export default function PincodeChecker() {
  const [pin, setPin] = useState('');
  const [result, setResult] = useState(null);

  const check = (e) => {
    e.preventDefault();
    setResult(estimateDelivery(pin));
  };

  return (
    <div className="card p-4 mt-5">
      <div className="flex items-center gap-2 text-sm font-semibold mb-2">
        <MapPin size={16} className="text-brand-600" />
        Check delivery
      </div>
      <form onSubmit={check} className="flex gap-2">
        <input
          className="input"
          placeholder="Enter pincode"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
        />
        <button className="btn-outline !px-4 !py-2 text-sm">Check</button>
      </form>

      {result && (
        <div
          className={`mt-3 p-3 rounded-lg text-xs flex gap-2 items-start ${
            result.ok
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}
        >
          {result.ok ? <CheckCircle2 size={14} className="mt-0.5 shrink-0" /> : <XCircle size={14} className="mt-0.5 shrink-0" />}
          {result.ok ? (
            <div>
              Delivery in <b>{result.days} business days</b>.{' '}
              {result.cod ? 'Cash on Delivery available.' : 'COD not available — prepaid only.'}{' '}
              {result.free && 'Free shipping on orders above ₹999.'}
            </div>
          ) : (
            <div>{result.reason}</div>
          )}
        </div>
      )}
    </div>
  );
}
