import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

dotenv.config();

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // 1. Existing Products fetch karo
    const products = await Product.find({});
    if (products.length === 0) {
      console.log('❌ No products found. Please seed products first.');
      process.exit(1);
    }
    console.log(`📦 Found ${products.length} products`);

    // 2. Purane dummy customers delete karo (agar hain)
    await User.deleteMany({ email: { $regex: /@testcustomer.com$/ } });
    console.log('🗑️ Old test customers removed');

       // 3. Naye 20 Customers banao
    const customers = [];
    const names = ['Ali Khan', 'Ahmed Raza', 'Sana Malik', 'Hamza Sheikh', 'Fatima Noor', 'Bilal Ahmed', 'Ayesha Khan', 'Usman Tariq', 'Zainab Ali', 'Hassan Raza', 'Maryam Javed', 'Fahad Iqbal', 'Nida Aslam', 'Saad Hussain', 'Rabia Ahmed', 'Talha Khan', 'Saba Fatima', 'Umar Farooq', 'Hira Shah', 'Adeel Akhtar'];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    for (let i = 0; i < 20; i++) {
      const customer = await User.create({
        name: names[i],
        email: `customer${i + 1}@test.com`, // <-- SIMPLE EMAIL
        password: hashedPassword,
        isAdmin: false,
        address: {
          street: `House ${i + 100}, Street ${i + 5}`,
          city: ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Toba Tek Singh'][i % 5],
          postalCode: `5400${i}`,
          country: 'Pakistan',
          phone: `+9230012345${i.toString().padStart(2, '0')}`,
        },
      });
      customers.push(customer);
    }
    console.log(`✅ Created ${customers.length} customers`);

    // 4. Purane dummy orders delete karo
    await Order.deleteMany({});
    console.log('🗑️ Old orders removed');

    // 5. 50 Dummy Orders banao
    const orders = [];
    const now = new Date();

    for (let i = 0; i < 50; i++) {
      // Random customer
      const customer = customers[Math.floor(Math.random() * customers.length)];
      
      // Random 1-3 products
      const numItems = Math.floor(Math.random() * 3) + 1;
      const orderItems = [];
      let totalPrice = 0;

      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 2) + 1;
        const price = product.price;
        totalPrice += price * quantity;

        orderItems.push({
          name: product.name,
          quantity: quantity,
          image: product.image,
          price: price,
          product: product._id,
          isReviewed: false,
        });
      }

      // Random delivery method
      const deliveryMethod = Math.random() > 0.5 ? 'Express' : 'Standard';
      const shippingCost = deliveryMethod === 'Express' ? 450 : 250;
      totalPrice += shippingCost;

      // Random date (last 30 days)
      const daysAgo = Math.floor(Math.random() * 30);
      const orderDate = new Date(now);
      orderDate.setDate(orderDate.getDate() - daysAgo);

      // Random status
      const statusRandom = Math.random();
      let isPaid = false;
      let isDelivered = false;

      if (statusRandom > 0.3) isPaid = true; // 70% paid
      if (statusRandom > 0.6) isDelivered = true; // 40% delivered

      const estimatedDelivery = new Date(orderDate);
      estimatedDelivery.setDate(estimatedDelivery.getDate() + (deliveryMethod === 'Express' ? 2 : 5));

      orders.push({
        user: customer._id,
        orderItems: orderItems,
        customerDetails: {
          fullName: customer.name,
          email: customer.email,
          phone: customer.address.phone,
          address1: customer.address.street,
          address2: '',
          city: customer.address.city,
          postalCode: customer.address.postalCode,
        },
        deliveryMethod: deliveryMethod,
        paymentMethod: Math.random() > 0.5 ? 'Cash on Delivery' : 'Online Payment',
        totalPrice: totalPrice,
        isPaid: isPaid,
        isDelivered: isDelivered,
        estimatedDelivery: estimatedDelivery,
        deliveredAt: isDelivered ? orderDate : null,
        createdAt: orderDate,
        updatedAt: orderDate,
      });
    }

    await Order.insertMany(orders);
    console.log(`✅ Created ${orders.length} orders successfully!`);
    console.log('🎉 You can now refresh your admin dashboard to see the data.');

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedOrders();