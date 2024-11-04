import Training from "../models/Training.js";
import DrillCategory from "../models/drillCategory.model.js";
import Drill from '../models/addDrill.model.js';
import TrainingPlanAssign from "../models/trainingPlanAssign.model.js";
import TrainingDrills from "../models/Trainingdrills.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose"; // Ensure mongoose is imported

const AddTrainings = asyncHandler(async (req, res) => {

  const { training_name, drill_category ,drill_name , weeks ,user_id} = req.body; 
  const image = req.image; 
  if (!user_id) {
    return res.status(401).json(new ApiError(401, [], "User not authenticated"));
  }
  const newTraining = new Training({
    training_name,
    drill_category,
    drill_name,
    weeks,
    image
  });
  const addCategorySuccess = await newTraining.save();
  if (!addCategorySuccess) {
    return res.status(500).json(
    new ApiError(500, [], "Something went wrong while adding Training Details")
    );
  }
  return res.status(200).json(new ApiResponse(200, { addCategorySuccess }, "Training created successfully"));
});

const getAllTrainings = async (req, res) => {
  try {
    const categories = await Training.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllTrainingsHome = async (req, res) => {
  try {
    const goalieId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(goalieId)) {
      return res.status(400).json({ message: "Invalid Goalie ID" });
    }

    const goalieObjectId = new mongoose.Types.ObjectId(goalieId);
    console.log("Goalie ID:", goalieObjectId);

    const trainings = await Training.aggregate([
      {
        $lookup: {
          from: "assigntrainings", // Ensure this matches the collection name in MongoDB
          localField: "_id",
          foreignField: "training_plan_id",
          as: "assignments"
        }
      },
      {
        $unwind: "$assignments"
      },
      {
        $match: { 
          "assignments.goalie_id": goalieObjectId // Explicit ObjectId conversion
        }
      },
      {
        $group: {
          _id: "$_id",
          trainingPlan: { $first: "$$ROOT" },
          tr_status: { $first: "$assignments.status" }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    console.log('trainings :', trainings);
    res.status(200).json(trainings);
  } catch (error) {
    console.error("Error fetching trainings:", error); // Improved error logging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const AddTrainingsDrills = asyncHandler(async (req, res) => {
  const { drill_category, drill_name ,trainingplan_id , weeks } = req.body; 
  // Create a new DrillCategory instance
  const newTrainingDrills = new TrainingDrills({
    trainingplan_id,
    drill_category,
    drill_name,
    weeks
  });
  const addDrillsSuccess = await newTrainingDrills.save();
  if (!addDrillsSuccess) {
    return res.status(500).json(
      new ApiError(500, [], "Something went wrong while adding Training Details")
    );
  }
  return res.status(200).json(new ApiResponse(200, { addDrillsSuccess }, "Training created successfully"));
});

export const UpdateTrainings = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { training_name } = req.body;
  const image = req.image;
  let updatedTraining = '';
  try {
    if(image == null){
       updatedTraining = await Training.findByIdAndUpdate(
        id,
        { training_name },
        { new: true }
      );
    }
    else{
       updatedTraining = await Training.findByIdAndUpdate(
        id,
        { training_name, image },
        { new: true }
      );
    }
    if (!updatedTraining) {
      return res.status(404).json({ message: "Training not found" });
    }
    res.status(200).json(updatedTraining); // Respond with the updated training record
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export const updateTrainingDrills = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { drill_category,  drill_name,  weeks } = req.body;
  try {
    const updatedTraining = await TrainingDrills.findByIdAndUpdate(
      id,
      { drill_category,  drill_name,  weeks },
      { new: true }
    );
    if (!updatedTraining) {
      return res.status(404).json({ message: "Training not found" });
    }
    res.status(200).json(updatedTraining); // Respond with the updated training record
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export const singleTrainingsDrills = async (req, res) => {  
  try {  
    const category = await TrainingDrills.find({ trainingplan_id: req.params.id });
    if (!category) {
      return res.status(404).json({ message: "Training not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const singleTrainingsDrillDetails = async (req, res) => {  
  try {
    const trainingDrills = await TrainingDrills.find({ trainingplan_id: req.params.id });

    if (!trainingDrills || trainingDrills.length === 0) {
      return res.status(404).json({ message: "Training not found" });
    }

    const drillDetailsWithCategory = await Promise.all(
      trainingDrills.map(async (drill) => {
        const drillDetail = await Drill.findById(drill.drill_name); // Assuming drill_name is the drill's ID
        if (!drillDetail) {
          throw new Error(`Drill not found for ID: ${drill.drill_name}`);
        }

        const categoryDetail = await DrillCategory.findById(drill.drill_category); // Assuming drill_category is the category's ID
        if (!categoryDetail) {
          throw new Error(`Category not found for ID: ${drill.drill_category}`);
        }

        return {
          drill_id: drillDetail._id,
          drill_name: drillDetail.drill_name,
          drill_description: drillDetail.description,
          drill_photo: drillDetail.photo,
          category_name: categoryDetail.category_name,
          weeks: drill.weeks,
        };
      })
    );

    res.status(200).json(drillDetailsWithCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const singleTrainings = async (req, res) => {
  try {
    const category = await Training.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Training not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletetrainings = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Training.findByIdAndDelete(id);  
      if (!category) {
        return res.status(404).json(new ApiError(404, [], "Training not found"));
      }
      await TrainingDrills.deleteMany({ trainingplan_id: id });
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Training deleted successfully"));
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json(new ApiError(500, [], "Server error while deleting Training"));
    }
});

const AssignTrainingPlan = asyncHandler(async (req, res) => {
  const { goalie_id, coach_id, training_plan_id } = req.body;
  if (!coach_id) {
    return res.status(401).json(new ApiError(401, [], "User not authenticated"));
  }
  const trainingPlans = Array.isArray(training_plan_id) ? training_plan_id : [training_plan_id];
  const assignedTrainings = [];
  try {
    await TrainingPlanAssign.deleteMany({ goalie_id });
    for (const training_plan_id of trainingPlans) {
      const newTraining = new TrainingPlanAssign({
        goalie_id,
        training_plan_id,
        coach_id
      });
      
      const addAssignTraining = await newTraining.save();  // Save to DB
      assignedTrainings.push(addAssignTraining);  // Add saved entry to response array
    }
    return res.status(200).json(
      new ApiResponse(200, { assignedTrainings }, "Training plans assigned successfully")
    );
  } catch (error) {
    return res.status(500).json(
      new ApiError(500, [], "Something went wrong while assigning training plans")
    );
  }
});

const getAllAssignedTrainings = async (req, res) => {
  try {
    const assignedTrainings = await TrainingPlanAssign.aggregate([
      {
        $lookup: {
          from: 'users', // Name of the users collection
          localField: 'goalie_id', // Field from TrainingPlanAssign
          foreignField: '_id', // Field from users collection
          as: 'goalieInfo', // Output array field
        },
      },
      {
        $unwind: { // Unwind goalieInfo to deconstruct the array
          path: '$goalieInfo',
          preserveNullAndEmptyArrays: true, // Keep documents without a match
        },
      },
      {
        $group: {
          _id: "$goalie_id", // Group by goalie ID
          goalie_name: { $first: "$goalieInfo.userName" },
          goalie_email: { $first: "$goalieInfo.email" },
          training_plans: { // Collect training plans into an array
            $push: {
              training_plan_name: "$training_name", // Ensure this field exists
              status: "$status", // Include status of each training plan
            },
          },
        },
      },
    ]);

    console.log("Assigned Trainings:", JSON.stringify(assignedTrainings, null, 2)); // Debugging output
    res.status(200).json(assignedTrainings); // Return the assigned trainings
  } catch (error) {
    console.error("Aggregation error:", error); // Improved error logging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getAllAssignedTrainingsByGoalieId = async (req, res) => {
  try {
    const assignments = await TrainingPlanAssign.find({ goalie_id: req.params.goalieId });

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({ message: "No assignments found for this goalie" });
    }
    res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAssignedTrainingsStatus = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get the assignment ID from the request parameters
  const { status } = req.body; // Get the new status from the request body

  try {
    // Find the assignment by ID and update the status
    const updatedAssignment = await TrainingPlanAssign.findByIdAndUpdate(
      id,
      { status }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json(updatedAssignment); // Respond with the updated assignment record
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


export { AddTrainings, getAllTrainings, AssignTrainingPlan, getAllAssignedTrainings, getAllAssignedTrainingsByGoalieId, getAllTrainingsHome };
