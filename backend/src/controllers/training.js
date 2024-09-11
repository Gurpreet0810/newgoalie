import Training from "../models/Training.js";
import TrainingDrills from "../models/Trainingdrills.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const AddTrainings = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { training_name, drill_category ,drill_name , weeks ,user_id} = req.body;
 
  const image = req.image; 

    // Check if the user is authenticated
    if (!user_id) {
        return res.status(401).json(new ApiError(401, [], "User not authenticated"));
    }

  // Create a new DrillCategory instance
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
    const categories = await Training.find(); // Fetch all categories
    res.status(200).json(categories);
    // console.log(categories);
  } catch (error) {
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



export const singleTrainingsDrills = async (req, res) => {
  try {
    const category = await TrainingDrills
    
    
    
    .findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Training not found" });
    }
    res.status(200).json(category);
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
// const getAllDrillCategories = async (req, res) => {
//   try {
//     const categories = await AddDrillCategory.find(); // Fetch all categories
//     res.status(200).json(categories);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// const getSingleDrillCategory = async (req, res) => {
//   try {
//     const category = await AddDrillCategory.findById(req.params.id);
//     if (!category) {
//       return res.status(404).json({ message: "Category not found" });
//     }
//     res.status(200).json(category);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const updateDrillCategory = async (req, res) => {
//   const { id } = req.params;
//   const { category_name, category_status } = req.body;

//   try {
//     // Construct the update fields
//     const updateFields = {
//       category_name,
//       category_status,
//     };

//     // Perform the update operation
//     const result = await AddDrillCategory.findByIdAndUpdate(id, updateFields, { new: true });

//     if (result) {
//       res.status(200).json(result); // Return the updated category
//     } else {
//       res.status(404).json({ message: "Category not found" });
//     }
//   } catch (error) {
//     console.error("Error updating category:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Delete a drill category
// const deleteDrillCategory = asyncHandler(async (req, res) => {
//     const { id } = req.params;
  
//     try {
//       // Find the category by id and delete it
//       const category = await AddDrillCategory.findByIdAndDelete(id);
  
//       if (!category) {
//         return res.status(404).json(new ApiError(404, [], "Category not found"));
//       }
  
//       return res
//         .status(200)
//         .json(new ApiResponse(200, {}, "Category deleted successfully"));
//     } catch (error) {
//       console.error("Error deleting category:", error);
//       res.status(500).json(new ApiError(500, [], "Server error while deleting category"));
//     }
//   });

//   const addDrill = asyncHandler(async (req, res) => {
//     const { drill_name, category, video_option, video_link, description, user_id } = req.body;
//     const photo = req.image;
//     const video_file = req.video;    
  
//     // Validate required fields
//     if (!drill_name || !category || !description) {
//       return res.status(404).json(new ApiError(404, [], "Drill name, category, and description are required"));
//     }
  
//     // Check if the user is authenticated
//     if (!user_id) {
//       return res.status(401).json(new ApiError(401, [], "User not authenticated"));
//     }
  
//     // Create a new Drill instance
//     const newDrill = new Drill({
//       drill_name,
//       category,
//       video_option,
//       description,
//       coach_id: user_id, // Assuming `coach_id` refers to the `user_id`
//     });
  
//     // Handle video option logic
//     if (video_option === 'video_upload' && video_file) {
//       newDrill.video_file = video_file; // Store video file
//       newDrill.video_link = "";
//     } else if (video_option === 'video_link' && video_link) {
//       newDrill.video_link = video_link; // Store video link
//       newDrill.video_file = "";      
//     }

//     if (photo) {
//       newDrill.photo = photo;
//     }
  
//     // Save the new drill
//     const addDrillSuccess = await newDrill.save();
  
//     // Error handling for failed save operation
//     if (!addDrillSuccess) {
//       return res.status(500).json(
//         new ApiError(500, [], "Something went wrong while adding Drill Details")
//       );
//     }
  
//     // Return a success response with the newly created drill
//     return res.status(200).json(
//       new ApiResponse(200, { addDrillSuccess }, "Drill created successfully")
//     );
//   });

//   const getAllDrills = async (req, res) => {
//     try {
//       const categories = await Drill.find(); // Fetch all categories
//       res.status(200).json(categories);
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   };

//   const getSingleDrill = async (req, res) => {
//     try {
//       const category = await Drill.findById(req.params.id);
//       if (!category) {
//         return res.status(404).json({ message: "Category not found" });
//       }
//       res.status(200).json(category);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Server error" });
//     }
//   };
  
//   const updateDrill = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const { drill_name, category, video_option, video_link, description, user_id } = req.body;
//     const photo = req.image; // Assuming photo is processed through middleware
//     const video_file = req.video; // Assuming video is processed through middleware

//     // Validate required fields
//     if (!drill_name || !category || !description) {
//         return res.status(404).json(new ApiError(404, [], "Drill name, category, and description are required"));
//     }

//     // Check if the user is authenticated
//     if (!user_id) {
//         return res.status(401).json(new ApiError(401, [], "User not authenticated"));
//     }

//     // Prepare the fields to update
//     const updateFields = {
//       drill_name,
//       category,
//       video_option,
//       description,
//       coach_id: user_id, // Assuming `coach_id` is linked to the authenticated user
//   };

//     // Handle video option logic
//     if (video_option === 'video_upload' && video_file) {
//         updateFields.video_file = video_file; // Update with the new video file
//         updateFields.video_link = ""; // Clear the video link
//     } else if (video_option === 'video_link' && video_link) {
//         updateFields.video_link = video_link; // Update with the new video link
//         updateFields.video_file = ""; // Clear the video file
//     }

//     // Update the photo if provided
//     if (photo) {
//         updateFields.photo = photo;
//     }

//     try {
//         // Find the drill by ID and update it
//         const updatedDrill = await Drill.findByIdAndUpdate(id, updateFields, { new: true });

//         // If no drill is found, return an error
//         if (!updatedDrill) {
//             return res.status(404).json(new ApiError(404, [], "Drill not found"));
//         }

//         // Return success response with the updated drill
//         return res.status(200).json(
//             new ApiResponse(200, { updatedDrill }, "Drill updated successfully")
//         );
//     } catch (error) {
//         // Handle any errors during the update process
//         return res.status(500).json(new ApiError(500, [], "Error updating drill"));
//     }
// });

// const deleteDrill = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Find the category by id and delete it
//     const drill = await Drill.findByIdAndDelete(id);

//     if (!drill) {
//       return res.status(404).json(new ApiError(404, [], "Drill not found"));
//     }

//     return res
//       .status(200)
//       .json(new ApiResponse(200, {}, "Drill deleted successfully"));
//   } catch (error) {
//     console.error("Error deleting drill:", error);
//     res.status(500).json(new ApiError(500, [], "Server error while deleting drill"));
//   }
// });


  export {     AddTrainings ,getAllTrainings
   };
