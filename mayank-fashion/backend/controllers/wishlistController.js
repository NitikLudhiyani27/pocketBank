const Wishlist = require('../models/Wishlist');

exports.get = async (req, res, next) => {
  try {
    let w = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!w) w = await Wishlist.create({ user: req.user._id, products: [] });
    res.json({ wishlist: w });
  } catch (e) { next(e); }
};

exports.toggle = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let w = await Wishlist.findOne({ user: req.user._id });
    if (!w) w = await Wishlist.create({ user: req.user._id, products: [] });
    const idx = w.products.findIndex((p) => String(p) === String(productId));
    if (idx >= 0) w.products.splice(idx, 1);
    else w.products.push(productId);
    await w.save();
    const populated = await Wishlist.findById(w._id).populate('products');
    res.json({ wishlist: populated });
  } catch (e) { next(e); }
};
