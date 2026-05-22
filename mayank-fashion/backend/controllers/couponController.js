const Coupon = require('../models/Coupon');

exports.apply = async (req, res, next) => {
  try {
    const { code, subtotal = 0 } = req.body;
    const c = await Coupon.findOne({ code: String(code).toUpperCase(), active: true });
    if (!c) return res.status(404).json({ message: 'Invalid coupon' });
    if (c.expiresAt && c.expiresAt < new Date()) return res.status(400).json({ message: 'Coupon expired' });
    if (subtotal < c.minOrder) return res.status(400).json({ message: `Min order ₹${c.minOrder}` });
    let discount = c.type === 'percent' ? Math.round((subtotal * c.value) / 100) : c.value;
    if (c.maxDiscount > 0) discount = Math.min(discount, c.maxDiscount);
    res.json({ coupon: { code: c.code, type: c.type, value: c.value }, discount });
  } catch (e) { next(e); }
};

exports.list = async (_req, res, next) => {
  try { res.json({ coupons: await Coupon.find().sort({ createdAt: -1 }) }); }
  catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try { res.status(201).json({ coupon: await Coupon.create(req.body) }); }
  catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try { await Coupon.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (e) { next(e); }
};
