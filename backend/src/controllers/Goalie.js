import AddGoalie from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addGoalie = asyncHandler(async (req, res) => {
    const {goalie_name: userName, phone: phoneNumber, email, password} = req.body
    const photo = req.image;

    if (!userName || !phoneNumber || !email || !password ) {
        return res.status(404)
      .json(new ApiError(404,
        [],
        "All fields are required"
      ))
    }

  const addGoalie = new AddGoalie({
    userName,
    phoneNumber,
    email,
    password,
    photo,
    roles: ['goalie']
  })

  const addGoalieSuccess = await addGoalie.save()
  if (!addGoalieSuccess) {
    return res.status(500)
      .json(new ApiError(500,
        [],
        "something went wrong while adding Product Details"
      ))
  }

  return res.status(200)
  .json(new ApiResponse(200, {addGoalieSuccess}, 'user created successfully'))
});

export const getAllGoalies = async (req, res) => {
  try {
    const goalies = await AddGoalie.find({ roles: { $in: ['goalie'] } }); // Assuming you have a Mongoose model called Goalie
    res.status(200).json(goalies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getSingleGoalie = async (req, res) => {
  try {
    const goalie = await AddGoalie.findById(req.params.id);
    
    if (!goalie) {
      return res.status(404).json({ message: 'Goalie not found' });
    }
    res.status(200).json(goalie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateGoalie = async (req, res) => {
  const { id } = req.params;
  const { goalie_name:userName, phone:phoneNumber, email } = req.body;
  const file = req.image;

  try {
    const updateFields = {
      userName,
      phoneNumber,
      email,
    };

    if (file) {
      const imagePath = req.image;
      updateFields.photo = imagePath;
    }

    const result = await AddGoalie.findByIdAndUpdate(id, updateFields, { new: true });

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Goalie not found' });
    }
  } catch (error) {
    console.error('Error updating goalie:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
 
export const deleteGoalie = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const result = await AddGoalie.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json(new ApiError(404, [], "Goalie not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Goalie deleted successfully"));
  } catch (error) {
    console.error("Error deleting Goalie:", error);
    res.status(500).json(new ApiError(500, [], "Server error while deleting Goalie"));
  }
});
export {addGoalie}