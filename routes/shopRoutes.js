const express = require('express');
const { loginShop, registerShop } = require('../controllers/shopController');

const shopRoutes = express.Router();

shopRoutes.post('/register', registerShop);
shopRoutes.post('/login', loginShop);

module.exports = shopRoutes;
