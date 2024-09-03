import mongoose, { Schema } from "mongoose";
import CreateOrder from "./createOrder..model.js"; // Ensure the path is correct

const productsOrderSchema = new mongoose.Schema({

  productImage: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  price: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  productColor: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  productSize: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
}, {
  timestamps: true
});

const ProductOrder = mongoose.model('ProductOrder', productsOrderSchema);

export default ProductOrder;
