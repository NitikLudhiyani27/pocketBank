const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { sendMail, orderConfirmationTemplate } = require('../utils/email');

exports.create = async (req, res, next) => {
  try {
    const { address, paymentMethod = 'COD', couponCode } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    const items = cart.items.map((i) => ({
      product: i.product._id,
      name: i.product.name,
      image: i.product.images?.[0],
      price: i.product.price,
      qty: i.qty,
      size: i.size,
      color: i.color,
    }));

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    let discount = 0;
    let coupon;
    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
      if (coupon && (!coupon.expiresAt || coupon.expiresAt > new Date()) && subtotal >= coupon.minOrder) {
        discount = coupon.type === 'percent'
          ? Math.round((subtotal * coupon.value) / 100)
          : coupon.value;
        if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
        coupon.usedCount += 1;
        await coupon.save();
      }
    }
    const shipping = subtotal - discount > 999 ? 0 : 49;
    const tax = Math.round((subtotal - discount) * 0.05);
    const total = subtotal - discount + shipping + tax;

    const order = await Order.create({
      user: req.user._id,
      items,
      address,
      subtotal, discount, shipping, tax, total,
      coupon: coupon?.code,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'pending',
      trackingId: 'MF' + Date.now().toString().slice(-8),
    });

    // Decrement stock
    await Promise.all(items.map((i) =>
      Product.updateOne({ _id: i.product }, { $inc: { stock: -i.qty } })
    ));

    // Clear cart
    cart.items = [];
    await cart.save();

    sendMail({
      to: req.user.email,
      subject: `Order Confirmed #${order._id}`,
      html: orderConfirmationTemplate(order),
    }).catch(() => {});

    res.status(201).json({ order });
  } catch (e) { next(e); }
};

exports.myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (e) { next(e); }
};

exports.getOne = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Not found' });
    if (String(order.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json({ order });
  } catch (e) { next(e); }
};

exports.list = async (_req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ orders });
  } catch (e) { next(e); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Not found' });
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();
    res.json({ order });
  } catch (e) { next(e); }
};

exports.cancel = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Not found' });
    if (String(order.user) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    if (['shipped', 'delivered'].includes(order.status))
      return res.status(400).json({ message: 'Cannot cancel a shipped/delivered order' });
    order.status = 'cancelled';
    await order.save();
    res.json({ order });
  } catch (e) { next(e); }
};
