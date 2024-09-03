import AddPrdouct from "../models/addProduct.model.js";
import ProductImages from "../models/productImages.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addProduct = asyncHandler(async (req, res) => {

    const {title, price, description, deliveryCode, productColor, productSize} = req.body
    // const productImages = req.files

    if (!title || !price || !description || !deliveryCode || !productColor || !productSize) {
        return res.status(404)
      .json(new ApiError(404,
        [],
        "All fields are required"
      ))
    }

  const addProduct = new AddPrdouct({
    title,
    price,
    description,
    deliveryCode,
    productColor,
    productSize
  })
  const addProductSuccess = await addProduct.save()
  if (!addProductSuccess) {
    return res.status(500)
      .json(new ApiError(500,
        [],
        "something went wrong while adding Product Details"
      ))
  }

  const Images = req.productImg;
  
  const productImagesPromises = Images.map(item => {

    const imagePath = item.path.replace(/^public\\/, '');
    const productImages = new ProductImages({
      productId: addProduct._id, // Reference the product ID
      productImages: imagePath
    });
    return productImages.save();
  });

  const productImagesSuccess = await Promise.all(productImagesPromises);

  if (!productImagesSuccess) {
    return res.status(500).json(new ApiError(500, [], "Something went wrong while adding Product images"));
  }

  return res.status(200).json(new ApiResponse(200, { addProductSuccess, productImagesSuccess }, "Successfully added product"));
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


export {addProduct}