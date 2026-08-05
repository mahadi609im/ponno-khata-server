const Shop = require('../models/Shop');

const loginShop = async (req, res) => {
  const { pin } = req.body;
  console.log('Body:', req.body);

  try {
    const shop = await Shop.findOne({ pin });
    const allShops = await Shop.find();
    console.log(allShops);

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
  loginShop,
};
