import mongoose, { Schema } from 'mongoose';

// Define the schema for Drill
const TrainingSchema = new mongoose.Schema({
  training_name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,  // Assuming photo is stored as a URL or file path
  },
  drill_category: {
    type: String,  // Store the file path or URL of the video file
  },
  drill_name: {
    type: String,  // Store the URL of the video link if video_option is 'video_link'
  }
}, {
  timestamps: true,
});

// Create and export the Drill model
const Training = mongoose.model('Training', TrainingSchema);

export default Training;
