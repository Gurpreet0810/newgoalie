import mongoose, { Schema } from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: Schema.Types.ObjectId,  // Reference to the blog category model
    ref: 'BlogCategory',  // Assuming your blog category model is named 'BlogCategory'
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  user_id: {
    type: Schema.Types.ObjectId,  // Reference to the user model
    ref: 'User',  // Assuming your user model is named 'User'
    required: true
  }
}, {
  timestamps: true  // This will automatically add createdAt and updatedAt fields
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;