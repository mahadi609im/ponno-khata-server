require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const shopRoutes = require('./routes/shopRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/shops', shopRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('PonnoKhata API Running...');
});

const cloudinary = require('./config/cloudinary');

console.log('Cloudinary Name:', process.env.CLOUDINARY_CLOUD_NAME);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
