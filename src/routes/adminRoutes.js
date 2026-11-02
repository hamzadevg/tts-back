import express from 'express';
import {
  getDashboardStats, getAllProducts, createProduct, updateProduct, deleteProduct,
  getAllOrders, markOrderDelivered, getAllCustomers, getAdminProfile, updateAdminProfile,
  getNotifications, getMonthlySales, getCategories, getInventory,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Dashboard
router.get('/dashboard', protect, admin, getDashboardStats);

// Products
router.route('/products')
  .get(protect, admin, getAllProducts)
  .post(protect, admin, createProduct);
router.route('/products/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// Orders
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id/deliver', protect, admin, markOrderDelivered);

// Customers
router.get('/customers', protect, admin, getAllCustomers);

// Profile
router.route('/profile')
  .get(protect, admin, getAdminProfile)
  .put(protect, admin, updateAdminProfile);

// Notifications
router.get('/notifications', protect, admin, getNotifications);

// Reports
router.get('/monthly-sales', protect, admin, getMonthlySales);

// Categories & Inventory (NEW)
router.get('/categories', protect, admin, getCategories);
router.get('/inventory', protect, admin, getInventory);

export default router;