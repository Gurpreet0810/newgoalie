import mongoose, { Schema } from 'mongoose';

// Define the schema for Drill
const HomeBannerSchema = new mongoose.Schema({
    title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,  // Store the file path or URL of the video file
  },
  photo: {
    type: String,      // Store the URL of the video link if video_option is 'video_link'
  },
  link:{
    type:String,
    required: true,
  }
}, {
  timestamps: true,
});

// Create and export the Drill model
const HomeBanner = mongoose.model('HomeBanner', HomeBannerSchema);

export default HomeBanner;
