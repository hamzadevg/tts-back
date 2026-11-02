import express from 'express';
import { 
  addOrderItems, 
  getMyOrders, 
  addProductReview, 
  trackOrder 
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:orderId/review').post(protect, addProductReview);
router.route('/track').post(trackOrder);

export default router;