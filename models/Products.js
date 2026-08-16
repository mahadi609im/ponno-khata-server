const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: '',
    },

    buyPrice: {
      type: Number,
      required: true,
    },

    minSellPrice: {
      type: Number,
      required: true,
    },

    maxSellPrice: {
      type: Number,
      required: true,
    },

    // নতুন নোট ফিল্ড যোগ করা হলো
    note: {
      type: String,
      default: '',
      trim: true,
    },
    stock: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
