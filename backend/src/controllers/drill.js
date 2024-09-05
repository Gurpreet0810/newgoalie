import AddDrillCategory from "../models/drillCategory.model.js"; // Assuming you have a DrillCategory model
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addDrillCategory = asyncHandler(async (req, res) => {
  const { category_name, category_status, user_id } = req.body;

  // Validate required fields
  if (!category_name || !category_status) {
    return res.status(404).json(new ApiError(404, [], "All fields are required"));
  }

    // Check if the user is authenticated
    if (!user_id) {
        return res.status(401).json(new ApiError(401, [], "User not authenticated"));
    }

  // Create a new DrillCategory instance
  const newCategory = new AddDrillCategory({
    category_name,
    category_status,
    coach_id: user_id,
  });

  const addCategorySuccess = await newCategory.save();

  if (!addCategorySuccess) {
    return res.status(500).json(
      new ApiError(500, [], "Something went wrong while adding Category Details")
    );
  }

  return res.status(200).json(new ApiResponse(200, { addCategorySuccess }, "Category created successfully"));
});

const getAllDrillCategories = async (req, res) => {
  try {
    const categories = await AddDrillCategory.find(); // Fetch all categories
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSingleDrillCategory = async (req, res) => {
  try {
    const category = await AddDrillCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateDrillCategory = async (req, res) => {
  const { id } = req.params;
  const { category_name, category_status } = req.body;

  try {
    // Construct the update fields
    const updateFields = {
      category_name,
      category_status,
    };

    // Perform the update operation
    const result = await AddDrillCategory.findByIdAndUpdate(id, updateFields, { new: true });

    if (result) {
      res.status(200).json(result); // Return the updated category
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a drill category
const deleteDrillCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the category by id and delete it
      const category = await AddDrillCategory.findByIdAndDelete(id);
  
      if (!category) {
        return res.status(404).json(new ApiError(404, [], "Category not found"));
      }
  
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Category deleted successfully"));
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json(new ApiError(500, [], "Server error while deleting category"));
    }
  });
  
  export { 
    addDrillCategory, 
    getAllDrillCategories, 
    getSingleDrillCategory, 
    updateDrillCategory, 
    deleteDrillCategory 
  };
