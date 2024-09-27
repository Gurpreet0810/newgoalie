import mongoose from "mongoose";  // Removed unused { Schema }

const LoaderSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: true,  // You can make the photo required if necessary
  },
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

export const LoaderImages = mongoose.model('LoaderImages', LoaderSchema);