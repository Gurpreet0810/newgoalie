import AddCoach from "../models/user.model.js";  // Assuming this is the User model
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addCoach = asyncHandler(async (req, res) => {
    const { coach_name: userName, phone: phoneNumber, email, password } = req.body;
    const coach_photo = req.image;  // Access the uploaded file if available

    if (!userName || !phoneNumber || !email || !password) {
        return res.status(404)
            .json(new ApiError(404, [], "All fields are required"));
    }

    const addCoach = new AddCoach({
        userName,
        phoneNumber,
        email,
        password,
        photo: coach_photo,
        roles: ['coach']
    });

    const addCoachSuccess = await addCoach.save();
    if (!addCoachSuccess) {
        return res.status(500)
            .json(new ApiError(500, [], "Something went wrong while adding Coach Details"));
    }

    return res.status(200)
        .json(new ApiResponse(200, { addCoachSuccess }, 'Coach created successfully'));
});

export const getAllCoaches = async (req, res) => {
    try {
        const coaches = await AddCoach.find({ roles: { $in: ['coach'] } }); // Fetch all coaches
        res.status(200).json(coaches);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getSingleCoach = async (req, res) => {
    try {
        const coach = await AddCoach.findById(req.params.id);

        if (!coach) {
            return res.status(404).json({ message: 'Coach not found' });
        }
        res.status(200).json(coach);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateCoach = async (req, res) => {
    const { id } = req.params;
    const { coach_name: userName, phone: phoneNumber, email } = req.body;

    const file = req.image;

    try {
        const updateFields = { userName, phoneNumber, email };

        if (file) {
            const imagePath = req.image;
            updateFields.photo = imagePath;  // Add image path if a file is uploaded
        }

        const result = await AddCoach.findByIdAndUpdate(id, updateFields, { new: true });

        if (result) {
            res.status(200).json(result); // Return updated coach
        } else {
            res.status(404).json({ message: 'Coach not found' });
        }
    } catch (error) {
        console.error('Error updating coach:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteCoach = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const result = await AddCoach.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json(new ApiError(404, [], "Coach not found"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Coach deleted successfully"));
    } catch (error) {
        console.error("Error deleting Coach:", error);
        res.status(500).json(new ApiError(500, [], "Server error while deleting Coach"));
    }
});

export { addCoach };