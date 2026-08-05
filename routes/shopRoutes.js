const express = require('express');
const { loginShop } = require('../controllers/shopController');

const shopRoutes = express.Router();

shopRoutes.post('/login', loginShop);

module.exports = shopRoutes;
