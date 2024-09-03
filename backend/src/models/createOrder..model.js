import mongoose, { Schema } from "mongoose";
import ProductOrder from "./productsOrder.model.js"; // Ensure the path is correct

const createOrderSchema = new mongoose.Schema({
  customerOrderId: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  totalPrice: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  totalItems: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  paymentStatus: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  deliveryStatus: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  productOrderId: [{
    type: Schema.Types.ObjectId,
    ref: 'ProductOrder',
  }],
}, {
  timestamps: true
});

const CreateOrder = mongoose.model('Orders', createOrderSchema);

export default CreateOrder;
