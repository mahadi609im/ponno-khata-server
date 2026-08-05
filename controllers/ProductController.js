const cloudinary = require('../config/cloudinary');
const Product = require('../models/Products');

// Create Product
const createProduct = async (req, res) => {
  try {
    const { shopId, categoryId, name, buyPrice, minSellPrice, maxSellPrice } =
      req.body;
    let imageUrl = '';

    // Image থাকলে Cloudinary তে upload হবে
    if (req.file) {
      if (!req.file.buffer) {
        throw new Error('Multer memory storage is required for buffer upload.');
      }

      const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      const result = await cloudinary.uploader.upload(fileBase64, {
        folder: 'ponno-khata/products',
      });

      imageUrl = result.secure_url;
    }

    const product = await Product.create({
      shopId,
      categoryId,
      name,
      image: imageUrl, // image optional
      buyPrice,
      minSellPrice,
      maxSellPrice,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create Product Backend Error Details:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// Get Products by Category
const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const products = await Product.find({ categoryId });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// Get Products by Shop
const getProductsByShop = async (req, res) => {
  const { shopId } = req.params;

  try {
    const products = await Product.find({ shopId });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  const { id } = req.params;

  const { name, image, buyPrice, minSellPrice, maxSellPrice } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        image,
        buyPrice,
        minSellPrice,
        maxSellPrice,
      },
      {
        new: true,
      },
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

module.exports = {
  createProduct,
  getProductsByCategory,
  getProductsByShop,
  updateProduct,
  deleteProduct,
};
