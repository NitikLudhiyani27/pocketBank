// Razorpay integration (with mock fallback when keys not set)
const crypto = require('crypto');
let Razorpay = null;
try { Razorpay = require('razorpay'); } catch { /* optional */ }

const getClient = () => {
  if (!Razorpay || !process.env.RAZORPAY_KEY_ID) return null;
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

exports.createOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR' } = req.body; // amount in INR (rupees)
    const client = getClient();
    if (!client) {
      // Mock order
      return res.json({
        provider: 'mock',
        order: { id: 'mock_' + Date.now(), amount: amount * 100, currency },
        keyId: 'mock',
      });
    }
    const order = await client.orders.create({
      amount: amount * 100, currency, receipt: 'rcpt_' + Date.now(),
    });
    res.json({ provider: 'razorpay', order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (e) { next(e); }
};

exports.verify = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.json({ verified: true, mock: true, paymentId: 'mock_pay_' + Date.now() });
    }
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    if (expected !== razorpay_signature) return res.status(400).json({ verified: false });
    res.json({ verified: true, paymentId: razorpay_payment_id });
  } catch (e) { next(e); }
};
