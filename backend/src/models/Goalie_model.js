import mongoose, { Schema } from "mongoose";

const addGoalieSchema = new mongoose.Schema({
    goalie_name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
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
  password: {
    type: String,
    required: true,
    trim: true,
  },
  goalie_photo: {
    type: String,
    trim: true,
  },

}, {
  timestamps: true
});


const AddGoalie = mongoose.model('Goalie', addGoalieSchema);

export default AddGoalie;
