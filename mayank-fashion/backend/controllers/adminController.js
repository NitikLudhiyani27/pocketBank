const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.stats = async (_req, res, next) => {
  try {
    const [users, products, orders, revenueAgg, recentOrders, lowStock] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5),
      Product.find({ stock: { $lte: 5 } }).limit(10),
    ]);

    // Sales last 7 days
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const sales = await Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      counts: { users, products, orders, revenue: revenueAgg[0]?.total || 0 },
      recentOrders,
      lowStock,
      sales,
    });
  } catch (e) { next(e); }
};

exports.users = async (_req, res, next) => {
  try { res.json({ users: await User.find().sort({ createdAt: -1 }) }); }
  catch (e) { next(e); }
};

exports.deleteUser = async (req, res, next) => {
  try { await User.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (e) { next(e); }
};
