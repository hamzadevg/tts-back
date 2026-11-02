import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      // FIX: product ab required nahi hai (kyunke demo products ke liye null ho sakta hai)
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false }, 
      isReviewed: { type: Boolean, default: false },
    },
  ],
  customerDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String, default: '' },
    city: { type: String, required: true },
    postalCode: { type: String, default: '' },
  },
  deliveryMethod: { type: String, required: true, default: 'Standard' },
  paymentMethod: { type: String, required: true, default: 'Cash on Delivery' },
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, required: true, default: false },
  isDelivered: { type: Boolean, required: true, default: false },
  estimatedDelivery: { type: Date, required: true },
  deliveredAt: { type: Date, default: null },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;