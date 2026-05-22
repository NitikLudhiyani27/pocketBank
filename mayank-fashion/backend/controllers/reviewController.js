const Review = require('../models/Review');
const Product = require('../models/Product');

exports.forProduct = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = await Review.findOneAndUpdate(
      { product: productId, user: req.user._id },
      { rating, comment, name: req.user.name },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      { $group: { _id: '$product', avg: { $avg: '$rating' }, n: { $sum: 1 } } },
    ]);
    if (stats[0]) {
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(stats[0].avg * 10) / 10,
        numReviews: stats[0].n,
      });
    }
    res.status(201).json({ review });
  } catch (e) { next(e); }
};
