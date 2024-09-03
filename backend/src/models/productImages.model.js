import mongoose, { Schema } from "mongoose";

const productImageSchema = new mongoose.Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
  },
  productImages: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

}, {
  timestamps: true
});


const ProductImages = mongoose.model('ProductImages', productImageSchema);

export default ProductImages;
