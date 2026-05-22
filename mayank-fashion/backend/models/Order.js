const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    price: Number,
    qty: Number,
    size: String,
    color: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [orderItemSchema],
    address: {
      fullName: String, phone: String, line1: String, line2: String,
      city: String, state: String, pincode: String, country: String,
    },
    subtotal: Number,
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: Number,
    coupon: String,
    paymentMethod: { type: String, enum: ['COD', 'RAZORPAY', 'MOCK'], default: 'COD' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    paymentId: String,
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
    trackingId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
