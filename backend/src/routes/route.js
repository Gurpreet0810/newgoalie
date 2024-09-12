import express from 'express';
import { editSingleAddress, editUserAddress, forgotPassword, updatePassword, getUserdata, updateProfile, getUserAddress, loginUser, logoutUser, removeUserAddress, signInRouter, userAddress } from '../controllers/user.controller.js';
import { verifyUser } from '../middleware/index.js';
import { getProductImg, getImg, getImgWithVideo } from '../middleware/multer.js';
import { addProduct } from '../controllers/addProduct.js';
import { createOrder, orderHistory } from '../controllers/createProductOrder.js';
import { getProductByName, getProducts } from '../controllers/getProduct.js';
import sendEmail from '../utils/nodemailer.js';
import { addGoalie, getAllGoalies, getSingleGoalie, updateGoalie, deleteGoalie } from '../controllers/Goalie.js';
import { addDrillCategory, getAllDrillCategories, getSingleDrillCategory, updateDrillCategory, deleteDrillCategory } from '../controllers/drill.js';
import { addDrill, getAllDrills, getSingleDrill, updateDrill, deleteDrill } from '../controllers/drill.js';
import { AddTrainings , getAllTrainings} from '../controllers/training.js';
import { addCoach, getAllCoaches, getSingleCoach } from '../controllers/Coach.js';

const router = express.Router()
router.post('/signIn', signInRouter)
router.post('/login', loginUser)
router.put('/forgotPassword', forgotPassword)
router.post('/resetPassword', updatePassword)
router.get('/user-profile', verifyUser, getUserdata)
router.post('/updateProfile', verifyUser, getImg ,updateProfile)
router.get('/logout', verifyUser, logoutUser)

router.post('/addDrillCat', verifyUser, addDrillCategory)
router.get('/drillCategories',  getAllDrillCategories)
router.get('/get_drill_category/:id', getSingleDrillCategory)
router.put('/update_drill_category/:id', updateDrillCategory)
router.delete('/drillCategories/:id', deleteDrillCategory)

router.post('/addDrill', verifyUser, getImgWithVideo, addDrill)
router.get('/drills',  getAllDrills)
router.get('/drills/:id', getSingleDrill)
router.put('/update_drill/:id', getImgWithVideo, updateDrill)
router.delete('/drills/:id', deleteDrill)
router.post('/addTraining', verifyUser, getImg, AddTrainings)
router.get('/trainings',  getAllTrainings)

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

router.get('/goalies', getAllGoalies);
router.post('/add_goalie', verifyUser, getProductImg ,addGoalie)
router.get('/get_goalies/:id', getSingleGoalie)
router.put('/update_goalie/:id', getProductImg, updateGoalie)
router.delete('/deleteGoalies/:id', deleteGoalie)

router.post('/add_coach', verifyUser ,addCoach)
router.get('/coaches', getAllCoaches)
router.get('/get_coach/:id', getSingleCoach)

export default router
