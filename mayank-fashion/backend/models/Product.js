const mongoose = require('mongoose');
const slugify = require('slugify');

const CATEGORIES = [
  'T-Shirts', 'Tops', 'Jeans', 'Pants', 'Kurti', 'Maxi Dresses',
  'Co-ord Sets', 'Ethnic Wear', 'Hoodies', 'Jackets', 'Skirts',
  'Sarees', 'Western Dresses', 'Party Wear', 'Casual Wear',
  'Footwear', 'Accessories',
];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, default: '' },
    brand: { type: String, default: 'Mayank Fashion' },
    category: { type: String, enum: CATEGORIES, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0 }, // percent, computed
    images: [{ type: String }],
    sizes: [{ type: String }], // e.g. ['XS','S','M','L','XL']
    colors: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Math.random().toString(36).slice(2, 7);
  }
  if (this.mrp > 0) this.discount = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  next();
});

productSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model('Product', productSchema);
