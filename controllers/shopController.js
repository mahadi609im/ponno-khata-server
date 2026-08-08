const Shop = require('../models/Shop');

const registerShop = async (req, res) => {
  const { shopName, pin, key } = req.body;

  try {
    // সব ফিল্ড আছে কিনা
    if (!shopName || !pin || !key) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Shop Name আগে থেকে আছে কিনা
    const existingShopName = await Shop.findOne({ shopName });

    if (existingShopName) {
      return res.status(400).json({
        success: false,
        message: 'Shop name already exists',
      });
    }

    // PIN আগে থেকে আছে কিনা
    const existingPin = await Shop.findOne({ pin });

    if (existingPin) {
      return res.status(400).json({
        success: false,
        message: 'PIN is already in use',
      });
    }

    // নতুন Shop তৈরি
    const shop = await Shop.create({
      shopName,
      pin,
      key,
    });

    return res.status(201).json({
      success: true,
      message: 'Shop registered successfully',
      shop: {
        _id: shop._id,
        shopName: shop.shopName,
        createdAt: shop.createdAt,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

const loginShop = async (req, res) => {
  const { pin } = req.body;

  try {
    const shop = await Shop.findOne({ pin }).select('-pin');

    if (!shop) {
      return res.status(401).json({
        success: false,
        message: 'Invalid PIN',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      shop,
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
  registerShop,
  loginShop,
};
