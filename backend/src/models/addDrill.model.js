import mongoose, { Schema } from 'mongoose';

// Define the schema for Drill
const drillSchema = new mongoose.Schema({
  drill_name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: Schema.Types.ObjectId,  // Reference to the DrillCategory model
    ref: 'DrillCategory',  // Ensure this matches the name of your DrillCategory model
    required: true,
  },
  photo: {
    type: String,  // Assuming photo is stored as a URL or file path
  },
  video_option: {
    type: String,
    enum: ['video_upload', 'video_link'],  // Enum to ensure valid values
    default: 'video_upload',
  },
  video_file: {
    type: String,  // Store the file path or URL of the video file
  },
  video_link: {
    type: String,  // Store the URL of the video link if video_option is 'video_link'
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  coach_id: {
    type: Schema.Types.ObjectId,  // Reference to the user model
    ref: 'User',  // Ensure this matches the name of your User model
    required: true,
  }
}, {
  timestamps: true,
});

// Create and export the Drill model
const Drill = mongoose.model('Drill', drillSchema);

export default Drill;
