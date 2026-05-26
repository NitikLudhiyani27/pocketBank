require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const img = (id) => `https://picsum.photos/seed/${id}/600/800`;

const SAMPLE = [
  // T-Shirts
  { name: 'Floral Print Crew Neck Tee', category: 'T-Shirts', price: 499, mrp: 999, sizes: ['XS','S','M','L'], colors: ['Pink','White'], featured: true, trending: true },
  { name: 'Pastel Oversized T-Shirt', category: 'T-Shirts', price: 599, mrp: 1199, sizes: ['S','M','L','XL'], colors: ['Lavender','Mint'] },
  // Tops
  { name: 'Ruffled Sleeve Crop Top', category: 'Tops', price: 699, mrp: 1499, sizes: ['XS','S','M'], colors: ['Black','White'], trending: true },
  { name: 'Off-Shoulder Satin Top', category: 'Tops', price: 899, mrp: 1799, sizes: ['S','M','L'], colors: ['Champagne'] },
  // Jeans
  { name: 'High-Rise Skinny Jeans', category: 'Jeans', price: 1299, mrp: 2499, sizes: ['26','28','30','32'], colors: ['Blue','Black'], featured: true },
  { name: 'Wide-Leg Mom Jeans', category: 'Jeans', price: 1499, mrp: 2799, sizes: ['26','28','30'], colors: ['Light Blue'] },
  // Pants
  { name: 'Pleated Wide Trousers', category: 'Pants', price: 1099, mrp: 2199, sizes: ['S','M','L'], colors: ['Beige','Black'] },
  { name: 'Cargo Joggers', category: 'Pants', price: 999, mrp: 1999, sizes: ['S','M','L','XL'], colors: ['Olive','Khaki'], trending: true },
  // Kurti
  { name: 'Anarkali Embroidered Kurti', category: 'Kurti', price: 1299, mrp: 2499, sizes: ['S','M','L','XL'], colors: ['Maroon'], featured: true },
  { name: 'Cotton A-Line Kurti', category: 'Kurti', price: 799, mrp: 1599, sizes: ['M','L','XL'], colors: ['Mustard','Indigo'] },
  // Maxi Dresses
  { name: 'Floral Tiered Maxi Dress', category: 'Maxi Dresses', price: 1599, mrp: 2999, sizes: ['S','M','L'], colors: ['Pink Floral'], trending: true, featured: true },
  { name: 'Solid Halter-Neck Maxi', category: 'Maxi Dresses', price: 1399, mrp: 2599, sizes: ['XS','S','M','L'], colors: ['Black'] },
  // Co-ord Sets
  { name: 'Linen Co-ord Lounge Set', category: 'Co-ord Sets', price: 1899, mrp: 3499, sizes: ['S','M','L'], colors: ['Sage','Cream'], featured: true },
  { name: 'Printed Crop Top & Pants Set', category: 'Co-ord Sets', price: 1699, mrp: 3199, sizes: ['S','M'], colors: ['Boho Print'] },
  // Palazzo Sets
  { name: 'Embroidered Kurta Palazzo Set', category: 'Palazzo Sets', price: 1799, mrp: 3499, sizes: ['S','M','L','XL'], colors: ['Powder Pink','Mint'], featured: true },
  { name: 'Block Print Palazzo Set with Dupatta', category: 'Palazzo Sets', price: 2199, mrp: 3999, sizes: ['M','L','XL'], colors: ['Indigo'], trending: true },
  // Night Suits
  { name: 'Satin Pajama Night Suit', category: 'Night Suits', price: 999, mrp: 1999, sizes: ['S','M','L','XL'], colors: ['Blush Pink','Black'], trending: true },
  { name: 'Cotton Printed Night Suit', category: 'Night Suits', price: 799, mrp: 1499, sizes: ['S','M','L'], colors: ['Lavender Floral'] },
  // Ethnic Wear
  { name: 'Banarasi Silk Lehenga Choli', category: 'Ethnic Wear', price: 4999, mrp: 8999, sizes: ['S','M','L'], colors: ['Red Gold'], featured: true },
  { name: 'Sharara Set with Dupatta', category: 'Ethnic Wear', price: 2999, mrp: 5499, sizes: ['M','L','XL'], colors: ['Pista Green'] },
  // Hoodies
  { name: 'Pastel Pullover Hoodie', category: 'Hoodies', price: 1199, mrp: 2299, sizes: ['S','M','L','XL'], colors: ['Lilac','Baby Pink'] },
  { name: 'Crop Zip-Up Hoodie', category: 'Hoodies', price: 1399, mrp: 2599, sizes: ['XS','S','M'], colors: ['Black','Grey'], trending: true },
  // Jackets
  { name: 'Quilted Puffer Jacket', category: 'Jackets', price: 2499, mrp: 4999, sizes: ['S','M','L'], colors: ['Beige','Black'] },
  { name: 'Denim Crop Jacket', category: 'Jackets', price: 1799, mrp: 3299, sizes: ['XS','S','M','L'], colors: ['Light Blue'] },
  // Skirts
  { name: 'Pleated Mini Skirt', category: 'Skirts', price: 899, mrp: 1799, sizes: ['XS','S','M'], colors: ['Black','Plaid'] },
  { name: 'Boho Tiered Maxi Skirt', category: 'Skirts', price: 1099, mrp: 2199, sizes: ['S','M','L'], colors: ['Floral'] },
  // Sarees
  { name: 'Designer Georgette Saree', category: 'Sarees', price: 2499, mrp: 4999, sizes: ['Free'], colors: ['Wine'], featured: true },
  { name: 'Cotton Handloom Saree', category: 'Sarees', price: 1499, mrp: 2999, sizes: ['Free'], colors: ['Off-White Red'] },
  // Western Dresses
  { name: 'Bodycon Midi Dress', category: 'Western Dresses', price: 1599, mrp: 2999, sizes: ['XS','S','M'], colors: ['Red','Black'], trending: true },
  { name: 'Wrap Floral Dress', category: 'Western Dresses', price: 1399, mrp: 2599, sizes: ['S','M','L'], colors: ['Blue Floral'] },
  // Party Wear
  { name: 'Sequin Party Mini Dress', category: 'Party Wear', price: 2299, mrp: 4499, sizes: ['XS','S','M','L'], colors: ['Silver','Gold'], featured: true },
  { name: 'Velvet Bodycon Gown', category: 'Party Wear', price: 2799, mrp: 5499, sizes: ['S','M','L'], colors: ['Emerald'] },
  // Casual Wear
  { name: 'Everyday Cotton Sundress', category: 'Casual Wear', price: 999, mrp: 1899, sizes: ['XS','S','M','L'], colors: ['Daisy','Stripe'] },
  { name: 'Casual Tunic Shirt', category: 'Casual Wear', price: 799, mrp: 1599, sizes: ['S','M','L'], colors: ['Sky','White'] },
  // Footwear
  { name: 'Block Heel Sandals', category: 'Footwear', price: 1499, mrp: 2999, sizes: ['36','37','38','39','40'], colors: ['Nude','Black'] },
  { name: 'Embellished Juttis', category: 'Footwear', price: 999, mrp: 1999, sizes: ['36','37','38','39'], colors: ['Gold','Silver'] },
  // Accessories
  { name: 'Statement Pearl Earrings', category: 'Accessories', price: 599, mrp: 1199, sizes: ['Free'], colors: ['Pearl White'], trending: true },
  { name: 'Crossbody Sling Bag', category: 'Accessories', price: 1299, mrp: 2499, sizes: ['Free'], colors: ['Tan','Black'] },
];

async function run() {
  await connectDB();
  console.log('Seeding...');

  await Promise.all([Product.deleteMany({}), Coupon.deleteMany({})]);

  // Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mayankfashion.com';
  const adminPwd = process.env.ADMIN_PASSWORD || 'admin123';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({ name: 'Admin', email: adminEmail, password: adminPwd, role: 'admin' });
    console.log(`Admin created: ${adminEmail} / ${adminPwd}`);
  } else {
    console.log(`Admin exists: ${adminEmail}`);
  }

  // Demo customer
  if (!(await User.findOne({ email: 'demo@mayankfashion.com' }))) {
    await User.create({ name: 'Demo User', email: 'demo@mayankfashion.com', password: 'demo123' });
    console.log('Demo user: demo@mayankfashion.com / demo123');
  }

  // Products
  let i = 0;
  for (const item of SAMPLE) {
    const id = `mf-${i++}`;
    await Product.create({
      ...item,
      description: `${item.name} — premium quality, designed for modern Indian women. Soft fabric, comfortable fit, and stunning details that make every outing feel special.`,
      images: [img(id), img(id + 'a'), img(id + 'b'), img(id + 'c')],
      stock: 25 + Math.floor(Math.random() * 80),
      tags: [item.category.toLowerCase(), 'women', 'fashion', 'mayank'],
      rating: 3.8 + Math.random() * 1.2,
      numReviews: Math.floor(Math.random() * 200),
    });
  }
  console.log(`Inserted ${SAMPLE.length} products`);

  // Coupons
  await Coupon.create([
    { code: 'WELCOME10', type: 'percent', value: 10, minOrder: 999, maxDiscount: 500 },
    { code: 'FLAT200', type: 'flat', value: 200, minOrder: 1499 },
    { code: 'MAYANK20', type: 'percent', value: 20, minOrder: 1999, maxDiscount: 1000 },
  ]);
  console.log('Coupons: WELCOME10, FLAT200, MAYANK20');

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((e) => { console.error(e); process.exit(1); });
