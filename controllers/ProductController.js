const cloudinary = require('../config/cloudinary');
const Product = require('../models/Products');
const Category = require('../models/Category');

// Create Product
const createProduct = async (req, res) => {
  try {
    const {
      shopId,
      categoryId,
      name,
      buyPrice,
      minSellPrice,
      maxSellPrice,
      note,
    } = req.body;
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
      note: note || '', // নতুন নোট ফিল্ড
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

// Get All Products Grouped By Category
const getGroupedProducts = async (req, res) => {
  const { shopId } = req.params;

  try {
    const categories = await Category.find({ shopId });

    const groupedProducts = await Promise.all(
      categories.map(async category => {
        const products = await Product.find({
          categoryId: category._id,
        });

        return {
          category,
          products,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      groupedProducts,
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
export const useUpdateProduct = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updateData }) => {
      // যদি ইমেজসহ বা শুধু ডেটা পাঠানো হয় (FormData বা সাধারণ Object)
      const isFormData = updateData instanceof FormData;

      const { data } = await axiosSecure.put(
        `/api/products/${id}`,
        updateData,
        {
          headers: {
            'Content-Type': isFormData
              ? 'multipart/form-data'
              : 'application/json',
          },
        },
      );

      return data;
    },

    onSuccess: (data, variables) => {
      const { updateData } = variables;

      const categoryId =
        updateData instanceof FormData
          ? updateData.get('categoryId')
          : updateData.categoryId;

      const shopId =
        updateData instanceof FormData
          ? updateData.get('shopId')
          : updateData.shopId;

      // Single Category Products
      if (categoryId) {
        queryClient.invalidateQueries({
          queryKey: ['products', categoryId],
        });
        queryClient.refetchQueries({
          queryKey: ['products', categoryId],
        });
      }

      // Shop Products & Grouped Products
      if (shopId) {
        queryClient.invalidateQueries({
          queryKey: ['products-shop', shopId],
        });
        queryClient.refetchQueries({
          queryKey: ['products-shop', shopId],
        });

        queryClient.invalidateQueries({
          queryKey: ['grouped-products', shopId],
        });
        queryClient.refetchQueries({
          queryKey: ['grouped-products', shopId],
        });
      }

      // Backup
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });
    },

    onError: error => {
      console.error(
        'Update Product Error:',
        error.response?.data || error.message,
      );
    },
  });
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
  getGroupedProducts,
  updateProduct,
  deleteProduct,
};
