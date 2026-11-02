import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    const adminEmail = 'admin@ttscollection.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('ℹ️ Admin already exists. Updating password...');
      const salt = await bcrypt.genSalt(10);
      existingAdmin.password = await bcrypt.hash('admin123', salt);
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
      console.log('✅ Admin password updated to: admin123');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
      });
      console.log('✅ Admin created!');
      console.log('📧 Email: admin@ttscollection.com');
      console.log('🔑 Password: admin123');
    }

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();