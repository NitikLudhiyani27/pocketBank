const Cart = require('../models/Cart');

const populate = (q) => q.populate('items.product');

exports.get = async (req, res, next) => {
  try {
    let cart = await populate(Cart.findOne({ user: req.user._id }));
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.json({ cart });
  } catch (e) { next(e); }
};

exports.add = async (req, res, next) => {
  try {
    const { productId, qty = 1, size, color } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    const idx = cart.items.findIndex(
      (i) => String(i.product) === String(productId) && i.size === size && i.color === color
    );
    if (idx >= 0) cart.items[idx].qty += Number(qty);
    else cart.items.push({ product: productId, qty: Number(qty), size, color });
    await cart.save();
    cart = await populate(Cart.findById(cart._id));
    res.json({ cart });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const { productId, size, color, qty } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.find(
      (i) => String(i.product) === String(productId) && i.size === size && i.color === color
    );
    if (!item) return res.status(404).json({ message: 'Item not in cart' });
    if (qty <= 0) cart.items = cart.items.filter((i) => i !== item);
    else item.qty = qty;
    await cart.save();
    const populated = await populate(Cart.findById(cart._id));
    res.json({ cart: populated });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const { productId, size, color } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(
      (i) => !(String(i.product) === String(productId) && i.size === size && i.color === color)
    );
    await cart.save();
    const populated = await populate(Cart.findById(cart._id));
    res.json({ cart: populated });
  } catch (e) { next(e); }
};

exports.clear = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] }, { new: true });
    res.json({ cart });
  } catch (e) { next(e); }
};
