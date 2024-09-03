import mongoose, { Schema } from "mongoose";

const addProductSchema = new mongoose.Schema({
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
  deliveryCode: {
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


const AddPrdouct = mongoose.model('Product', addProductSchema);

export default AddPrdouct;
