const express = require('express');
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const categoryRoutes = express.Router();

// Create Category
categoryRoutes.post('/', createCategory);

// Get Categories by Shop
categoryRoutes.get('/:shopId', getCategories);

// Update Category
categoryRoutes.patch('/:id', updateCategory);

// Delete Category
categoryRoutes.delete('/:id', deleteCategory);

module.exports = categoryRoutes;
