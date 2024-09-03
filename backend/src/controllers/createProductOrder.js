import AddProduct from "../models/addProduct.model.js";
import CreateOrder from "../models/createOrder..model.js";
import ProductImages from "../models/productImages.model.js";
import ProductOrder from "../models/productsOrder.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.decoded;
    const { productId } = req.body;

    const existingUser = await User.findOne({ _id });
    if (!existingUser) {
        return res.status(404)
            .json(new ApiError(404, [], 'User does not exist. Please login.'));
    }

    const orderDetails = await Promise.all(
        productId.map(async (item) => {
            const singleProductDetails = await ProductImages.findOne({ _id: item._id }).populate('productId');
            if (!singleProductDetails) {
                throw new ApiError(404, [], 'Product not found');
            }

            const createProductOrder = new ProductOrder({
                productImage: singleProductDetails.productImages,
                title: singleProductDetails.productId.title,
                price: singleProductDetails.productId.price,
                description: singleProductDetails.productId.description,
                productColor: singleProductDetails.productId.productColor,
                productSize: singleProductDetails.productId.productSize,
            });

            const isProductOrderSuccess = await createProductOrder.save();
            return isProductOrderSuccess;
        })
    );

    if (orderDetails.length === 0) {
        return res.status(500)
            .json(new ApiError(500, [], 'Something went wrong while fetching products.'));
    }

    const totalPrice = orderDetails.reduce((acc, item) => acc + parseFloat(item.price), 0);

    let randomNum = Math.floor(Math.random() * 10000000);

    const isOrderCreate = new CreateOrder({
        productOrderId: orderDetails.map(order => order._id),
        totalPrice: totalPrice.toString(),
        totalItems: orderDetails.length.toString(),
        paymentStatus: 'success',
        deliveryStatus: 'delivered',
        customerOrderId: randomNum
    });

    const isOrderCreateSuccess = await (await isOrderCreate.save()).populate('productOrderId');
    if (!isOrderCreateSuccess) {
        return res.status(500)
            .json(new ApiError(500, [], 'Something went wrong while creating customer order.'));
    }

    return res.status(200)
        .json(new ApiResponse(200, { Products: isOrderCreateSuccess },
            'Your order was created successfully.'));
});

const orderHistory = asyncHandler(async (req, res) => {

    const orderHistoryList = await CreateOrder.find().populate('productOrderId')
    if (!orderHistoryList) {
        return res.status(400)
            .json(new ApiError(400, [], 'no record found'))
    }

    return res.json(new ApiResponse(200, orderHistoryList, 'Your order fetch successfully'))
})

export { createOrder, orderHistory };
