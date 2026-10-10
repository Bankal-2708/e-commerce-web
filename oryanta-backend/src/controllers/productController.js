import { Product } from '../models/Product.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// CREATE product
export const createProduct = async (req, res) => {
  try {
    const {
      name, description, price, discountPrice,
      category, sizes, tags, stock,
    } = req.body;

    const parsedSizes = typeof sizes === 'string'
      ? sizes.split(',').map((s) => s.trim()).filter(Boolean)
      : sizes;

    const parsedTags = typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : tags || [];

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least 1 image is required',
      });
    }

    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, 'oryanta/products')
    );
    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const product = await Product.create({
      seller: req.user._id,
      name,
      description,
      price: Number(price),
      discountPrice: Number(discountPrice) || 0,
      category,
      sizes: parsedSizes,
      tags: parsedTags,
      stock: Number(stock) || 1,
      images: imageUrls,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

// GET seller's own products
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET all products (public)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('seller', 'fullName')
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'fullName email');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this product',
      });
    }

    const {
      name, description, price, discountPrice,
      category, sizes, tags, stock, isActive,
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = Number(price);
    if (discountPrice !== undefined) updateData.discountPrice = Number(discountPrice);
    if (category) updateData.category = category;
    if (stock !== undefined) updateData.stock = Number(stock);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (sizes) {
      updateData.sizes = typeof sizes === 'string'
        ? sizes.split(',').map((s) => s.trim())
        : sizes;
    }
    if (tags) {
      updateData.tags = typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim())
        : tags;
    }

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, 'oryanta/products')
      );
      const uploadResults = await Promise.all(uploadPromises);
      updateData.images = uploadResults.map((r) => r.secure_url);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Product updated',
      product: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};