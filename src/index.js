
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('TTS Backend is running 🚀');
});

// Connect to MongoDB once and reuse the connection
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing');
  }

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;

  console.log('MongoDB Connected');
}

// Vercel serverless handler
const handler = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Backend error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

export default handler;

// Local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(error => {
      console.error('MongoDB Connection Error:', error.message);
    });
}
