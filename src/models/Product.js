import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  gender: { type: String, enum: ['male', 'female', 'unisex'], default: 'unisex' },
  category: { type: String, required: true },
  subCategory: { type: String, default: 'general' },
  brand: { type: String, default: '' },
  tags: [{ type: String }],
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: null },
  discountPercent: { type: Number, default: 0 },
  oldPrice: { type: Number },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  isSale: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Published' },
  images: [{ type: String }],
  image: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  productReviews: [reviewSchema],
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;