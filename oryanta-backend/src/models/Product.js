import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
      default: 0,
    },
    category: {
      type: String,
      enum: ['Men', 'Women', 'Kids', 'Unisex', 'Accessories'],
      default: 'Unisex',
    },
    sizes: {
      type: [String],
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'At least one size is required',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],           // ← Yeh important hai
      default: [],
      validate: {
        validator: (v) => Array.isArray(v) && v.length >= 1 && v.length <= 6,
        message: 'Between 1 and 6 images required',
      },
    },
    stock: {
      type: Number,
      default: 1,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', tags: 'text' });

export const Product = mongoose.model('Product', productSchema);
export default Product;