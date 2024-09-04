import AddGoalie from "../models/Goalie_model.js";
// import ProductImages from "../models/productImages.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addGoalie = asyncHandler(async (req, res) => {
    // console.log(req.body);
    const {goalie_name,phone,email,password} = req.body
    const goalie_photo = req.image;  // Access the uploaded file

    if (!goalie_name || !phone || !email || !password ) {
        return res.status(404)
      .json(new ApiError(404,
        [],
        "All fields are required"
      ))
    }

  const addGoalie = new AddGoalie({
    goalie_name,
    phone,
    email,
    password,
    goalie_photo
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


// const getAllProducts = asyncHandler(async (req, res) => {
//   try {
//     // Fetch all ProductImages and populate AddProduct details
//     const allProducts = await ProductImages.find().populate('productId');

//     // Check if no products found
//     if (!allProducts || allProducts.length === 0) {
//       return res.status(404).json(new ApiError(404, [], 'No products found'));
//     }

//     // Return success response with all products and images
//     return res.status(200).json(new ApiResponse(200, allProducts, 'Successfully fetched all products'));
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return res.status(500).json(new ApiError(500, [], 'Something went wrong while fetching products'));
//   }
// });
export const getAllGoalies = async (req, res) => {
  try {
    const goalies = await AddGoalie.find(); // Assuming you have a Mongoose model called Goalie
    res.status(200).json(goalies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




export {addGoalie}