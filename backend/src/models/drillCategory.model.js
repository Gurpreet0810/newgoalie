import mongoose, { Schema } from "mongoose";

const drillCategorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  category_status: {
    type: String,
    required: true,
    enum: ['active', 'not-active'], // Assuming these are the two possible values
    lowercase: true
  },
  coach_id: {
    type: Schema.Types.ObjectId,  // Reference to the user model
    ref: 'user',  // Assuming your user model is named 'User'
    required: true
  }
}, {
  timestamps: true
});

const DrillCategory = mongoose.model('DrillCategory', drillCategorySchema);

export default DrillCategory;
