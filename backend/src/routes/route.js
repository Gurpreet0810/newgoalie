import express from 'express';
import { editSingleAddress, editUserAddress, forgotPassword, updatePassword, getUserdata, getUserAddress, loginUser, logoutUser, removeUserAddress, signInRouter, userAddress } from '../controllers/user.controller.js';
import { verifyUser } from '../middleware/index.js';
import { getProductImg } from '../middleware/multer.js';
import { addProduct } from '../controllers/addProduct.js';
import { createOrder, orderHistory } from '../controllers/createProductOrder.js';
import { getProductByName, getProducts } from '../controllers/getProduct.js';
import sendEmail from '../utils/nodemailer.js';


const router = express.Router()
router.post('/signIn', signInRouter)
router.post('/login', loginUser)
router.put('/forgotPassword', forgotPassword)
router.post('/resetPassword', updatePassword)
router.get('/user-profile', verifyUser, getUserdata)
// router.get('/user-profile', getUserdata);
router.post('/logout', verifyUser, logoutUser)
router.post('/addProduct', verifyUser, getProductImg, addProduct)
router.post('/add-address', verifyUser, userAddress)
router.post('/create-order', verifyUser, createOrder)
router.get('/order-history', verifyUser, orderHistory)
router.get('/get-all-products', getProducts)
router.get('/get-product', getProductByName)
router.get('/get-address', verifyUser, getUserAddress)
router.post('/edit-address', verifyUser, editUserAddress)
router.post('/edit-personal-address', verifyUser, editSingleAddress)
router.get('/remove-address', verifyUser, removeUserAddress)
router.get('/send-email', sendEmail)

export default router
