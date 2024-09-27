import mongoose, { Schema } from 'mongoose';

// Define the schema for Drill
const TrainingDrillsSchema = new mongoose.Schema({
  trainingplan_id: {
    type: String,
    required: true,
    trim: true,
  },
  drill_category: {
    type: String,  // Store the file path or URL of the video file
  },
  drill_name: {
    type: String,  // Store the URL of the video link if video_option is 'video_link'
  },
  weeks:{
    type: [String]
  }
}, {
  timestamps: true,
});

// Create and export the Drill model
const TrainingDrills = mongoose.model('TrainingDrills', TrainingDrillsSchema);

export default TrainingDrills;
