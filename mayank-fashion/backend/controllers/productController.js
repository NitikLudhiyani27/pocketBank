const Product = require('../models/Product');

exports.list = async (req, res, next) => {
  try {
    const {
      q, category, minPrice, maxPrice, size, color,
      sort = 'newest', page = 1, limit = 12,
      featured, trending,
    } = req.query;

    const filter = { isActive: true };
    if (q) filter.$or = [
      { name: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') },
      { tags: new RegExp(q, 'i') },
    ];
    if (category) filter.category = category;
    if (size) filter.sizes = size;
    if (color) filter.colors = new RegExp(`^${color}$`, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (featured === 'true') filter.featured = true;
    if (trending === 'true') filter.trending = true;

    const sortMap = {
      newest: { createdAt: -1 },
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      ratingDesc: { rating: -1 },
      popular: { numReviews: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Product.find(filter).sort(sortMap[sort] || sortMap.newest).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e) { next(e); }
};

exports.categories = (_req, res) => res.json({ categories: Product.CATEGORIES });

exports.getOne = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { slug: req.params.id }],
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    }).limit(8);

    res.json({ product, related });
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json({ product });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
};

// Simple recommendations: same category + similar price range, fallback trending
exports.recommend = async (req, res, next) => {
  try {
    const { id } = req.params;
    const base = await Product.findById(id);
    if (!base) {
      const trending = await Product.find({ isActive: true, trending: true }).limit(8);
      return res.json({ items: trending });
    }
    const lo = base.price * 0.6, hi = base.price * 1.4;
    const items = await Product.find({
      _id: { $ne: base._id },
      category: base.category,
      price: { $gte: lo, $lte: hi },
      isActive: true,
    }).sort({ rating: -1 }).limit(8);
    res.json({ items });
  } catch (e) { next(e); }
};
