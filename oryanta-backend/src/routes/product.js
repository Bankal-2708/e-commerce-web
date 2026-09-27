import express from 'express';
import {
  createProduct,
  getMyProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { sellerOnly } from '../middleware/seller.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Reuse — seller auth + image upload, 3 jagah use hoga
const sellerAuth = [protect, sellerOnly];
const imageUpload = upload.array('images', 6); // max 6 images

// Public routes
router.get('/', getAllProducts);

// Seller-only routes
router.post('/', sellerAuth, imageUpload, createProduct);
router.get('/seller/me', sellerAuth, getMyProducts); // keep above /:id

// Single product
router.get('/:id', getProductById);
router.put('/:id', sellerAuth, imageUpload, updateProduct);
router.delete('/:id', sellerAuth, deleteProduct);

export default router;