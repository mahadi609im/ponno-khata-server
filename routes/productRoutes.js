const express = require('express');

const {
  createProduct,
  getProductsByCategory,
  getProductsByShop,
  deleteProduct,
  updateProduct,
} = require('../controllers/ProductController');
const upload = require('../middleware/upload');

const productRoutes = express.Router();

// Create Product
productRoutes.post('/', upload.single('image'), createProduct);

// Get Products by Category
productRoutes.get('/category/:categoryId', getProductsByCategory);

// Get Products by Shop
productRoutes.get('/shop/:shopId', getProductsByShop);

// Update Product
productRoutes.patch('/:id', updateProduct);

// Delete Product
productRoutes.delete('/:id', deleteProduct);

module.exports = productRoutes;
