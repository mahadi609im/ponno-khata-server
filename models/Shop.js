const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    pin: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
      maxlength: 6,
    },

    key: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Shop', shopSchema);
