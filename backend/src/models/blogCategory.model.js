import mongoose, { Schema } from "mongoose";

const blogCategorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  user_id: {
    type: Schema.Types.ObjectId,  // Reference to the user model
    ref: 'User',  // Assuming your user model is named 'User'
    required: true
  }
}, {
  timestamps: true
});

const BlogCategory = mongoose.model('BlogCategory', blogCategorySchema);

export default BlogCategory;
