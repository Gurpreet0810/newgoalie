import AddPrdouct from "../models/addProduct.model.js";
import ProductImages from "../models/productImages.model.js";
import ProductOrder from "../models/productsOrder.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, name } = req.query; 
    // Use req.body to get the parameters

console.log('>>>>>>>>>><<<<<<<<<<<<<<<<<');
    console.log('req.body:', req.query); // Log the entire body object
console.log('>>>>>>>>>><<<<<<<<<<<<<<<<<');


    try {
        let query = {};

        // If 'name' parameter is provided, filter by name
        if (name) {
            // Find products that match the name
            const products = await AddPrdouct.find({ title: { $regex: new RegExp(name, 'i') } });
            const productIds = products.map(product => product._id);

            // Set query to match productIds
            query = { productId: { $in: productIds } };
        }

        // Fetch the total count of documents based on the query
        const totalRecords = await ProductImages.countDocuments(query);

        // Apply pagination and search criteria
        const fetchProductList = await ProductImages.find(query)
            .populate('productId')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // console.log('fetchProductList:', fetchProductList);

        // Check if no records were found
        if (fetchProductList.length === 0) {
            return res.status(404)
                .json(new ApiResponse(404, [], 'No record found'));
        }

        // Return the paginated results along with the total count
        return res.status(200)
            .json(new ApiResponse(200, { products: fetchProductList, totalRecords }, 'Success'));

    } catch (error) {
        console.error('Error in getProductByName:', error);
        return res.status(500)
            .json(new ApiError(500, [], 'Internal Server Error'));
    }
    // const { page = 1, limit = 20 } = req.query;
    
    // try {
    //     // Fetch the total count of documents
    //     const totalRecords = await ProductImages.countDocuments();

    //     // Apply pagination
    //     const fetchProductList = await ProductImages.find()
    //         .populate('productId')
    //         .sort({ createdAt: -1 })
    //         .skip((page - 1) * limit)
    //         .limit(parseInt(limit));

    //     // Check if no records were found
    //     if (fetchProductList.length === 0) {
    //         return res.status(404)
    //             .json(new ApiResponse(404, [], 'No record found'));
    //     }

    //     // Return the paginated results along with the total count
    //     return res.status(200)
    //         .json(new ApiResponse(200, { products: fetchProductList, totalRecords }, 'Success'));

    // } catch (error) {
    //     return res.status(500)
    //         .json(new ApiError(500, [], 'Internal Server Error'));
    // }
});

const getProductByName = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, name } = req.query; 
    // Use req.body to get the parameters

console.log('>>>>>>>>>><<<<<<<<<<<<<<<<<');
    console.log('req.body:', req.query); // Log the entire body object
console.log('>>>>>>>>>><<<<<<<<<<<<<<<<<');


    try {
        let query = {};

        // If 'name' parameter is provided, filter by name
        if (name) {
            // Find products that match the name
            const products = await AddPrdouct.find({ title: { $regex: new RegExp(name, 'i') } });
            const productIds = products.map(product => product._id);

            // Set query to match productIds
            query = { productId: { $in: productIds } };
        }

        // Fetch the total count of documents based on the query
        const totalRecords = await ProductImages.countDocuments(query);

        // Apply pagination and search criteria
        const fetchProductList = await ProductImages.find(query)
            .populate('productId')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // console.log('fetchProductList:', fetchProductList);

        // Check if no records were found
        if (fetchProductList.length === 0) {
            return res.status(404)
                .json(new ApiResponse(404, [], 'No record found'));
        }

        // Return the paginated results along with the total count
        return res.status(200)
            .json(new ApiResponse(200, { products: fetchProductList, totalRecords }, 'Success'));

    } catch (error) {
        console.error('Error in getProductByName:', error);
        return res.status(500)
            .json(new ApiError(500, [], 'Internal Server Error'));
    }
});




export { getProducts ,getProductByName};
