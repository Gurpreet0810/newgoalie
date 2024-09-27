import HomeBanner from "../models/Homebanner.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";




export const addHomeBanner = asyncHandler(async (req, res) => {
    const { title,   content ,link   } = req.body;
    const photo = req.image;


    const newHomeBanner = new HomeBanner({
        title,
        content,
        link,
        photo
    });
  
    const addHomeBanner = await newHomeBanner.save();
  
    if (!addHomeBanner) {
      return res.status(500).json(
        new ApiError(500, [], "Something went wrong while adding Home Banner Added")
      );
    }
  
    return res.status(200).json(new ApiResponse(200, { addHomeBanner }, "Home Banner Added successfully"));
  });

  export const getHomeBanner = async (req, res) => {
    try {
      // Fetch all categories and sort by createdAt in descending order (latest first)
      const gethomebanners = await HomeBanner.find().sort({ createdAt: -1 });
      res.status(200).json(gethomebanners);
    } catch (error) {
      console.error("Error fetching Home Banner:", error); // Log the error to the server console
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


 export const updateHomeBanner = async (req, res) => {
    const { id } = req.params;
    const {   title, content,  link } = req.body;
    const photo = req.image;
 
let updateFields = '';
    try {
        if(photo==null){
             updateFields = {
                title,
                content,
                link
              };
        }
        else{
             updateFields = {  title, content, link, photo };
        }
    
        const result = await HomeBanner.findByIdAndUpdate(id, updateFields, { new: true });
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Home Banner not found" });
      }
    } catch (error) {
      console.error("Error updating  Home Banner :", error);
      res.status(500).json({ message: "Server error" });
    }
  };