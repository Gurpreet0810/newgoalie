import mongoose, { Schema } from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  userName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  addressType: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  addressArea: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  landmark: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  pinCode: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  town_or_city: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  state: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  type: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
}, {
  timestamps: true
});

const UserAddress = mongoose.model('address', addressSchema);

export default UserAddress;
