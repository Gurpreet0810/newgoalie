import mongoose, { Schema } from 'mongoose';

const AssignTrainingSchema = new mongoose.Schema({
  goalie_id: {
    type: Schema.Types.ObjectId,
    ref: 'Goalie_model',
    required: true,
  },
  coach_id: {
    type: Schema.Types.ObjectId,
    ref: 'coach',
    required: true,
  },
  training_plan_id: {
    type: Schema.Types.ObjectId,
    ref: 'Training',
    required: true,
  },
  status: {
    type: Number,
    enum: [0, 1, 2],  // 0 = Not started, 1 = In progress, 2 = Completed
    default: 0,  // Default status is "Not started"
  },
}, {
  timestamps: true,
});

const AssignTraining = mongoose.model('AssignTraining', AssignTrainingSchema);
export default AssignTraining;
