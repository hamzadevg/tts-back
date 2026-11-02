import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, customerDetails, deliveryMethod, paymentMethod, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const deliveryDays = deliveryMethod === 'Express' ? 2 : 5;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays);

    const validOrderItems = orderItems.map(item => {
      const isValidObjectId = item.product && /^[0-9a-fA-F]{24}$/.test(item.product);
      return {
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: isValidObjectId ? item.product : null,
        isReviewed: false,
      };
    });

    const order = new Order({
      orderItems: validOrderItems,
      user: req.user._id,
      customerDetails,
      deliveryMethod,
      paymentMethod,
      totalPrice,
      estimatedDelivery,
      isPaid: paymentMethod === 'Online Payment' ? true : false,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// @desc    Get logged in user orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// @desc    Add Product Review
export const addProductReview = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;
    const userName = req.user.name;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.productReviews?.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product.' });
    }

    const review = { user: userId, name: userName, rating: Number(rating), comment };
    if (!product.productReviews) product.productReviews = [];
    product.productReviews.push(review);
    product.reviews = product.productReviews.length;
    product.rating = (
      product.productReviews.reduce((acc, item) => item.rating + acc, 0) /
      product.productReviews.length
    ).toFixed(1);

    await product.save();

    const order = await Order.findById(orderId);
    if (order) {
      const itemIndex = order.orderItems.findIndex(
        (item) => item.product && item.product.toString() === productId.toString()
      );
      if (itemIndex !== -1) {
        order.orderItems[itemIndex].isReviewed = true;
        await order.save();
      }
    }

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track Order by Phone or Order ID (Public)
// @route   POST /api/orders/track
export const trackOrder = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Please provide a phone number or order ID' });
    }

    let searchQuery = {};
    
    // Check if its an ObjectId (24 chars) or phone/email
    if (/^[0-9a-fA-F]{24}$/.test(query)) {
      searchQuery = { _id: query };
    } else {
      searchQuery = { 
        $or: [
          { 'customerDetails.phone': { $regex: query, $options: 'i' } },
          { 'customerDetails.email': { $regex: query, $options: 'i' } }
        ]
      };
    }

    const orders = await Order.find(searchQuery).sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for these details' });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};