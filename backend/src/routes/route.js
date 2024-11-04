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
import { addDrill, getAllDrills, getAllCoachDrills, getAllDrillsbycategory, getSingleDrill, updateDrill, deleteDrill, getSingleDrillWithCats } from '../controllers/drill.js';
import { AddTrainings, updateTrainingDrills, deletetrainings, UpdateTrainings, getAllTrainings, AddTrainingsDrills, singleTrainings, singleTrainingsDrills, AssignTrainingPlan, getAllAssignedTrainings, getAllAssignedTrainingsByGoalieId, updateAssignedTrainingsStatus, getAllTrainingsHome, singleTrainingsDrillDetails } from '../controllers/training.js';
import { addCoach, deleteCoach, getAllCoaches, getSingleCoach, updateCoach } from '../controllers/Coach.js';
import { addBlogCategory, Addloaderimage,updateBlog,updateloaderimage, Getloaderimage  ,getAllBlogCategories, getSingleBlogCategory, updateBlogCategory, deleteBlogCategory, addBlog, getAllBlogs, deleteBlog, getSingleBlog } from '../controllers/Blog.js';
import { addHomeBanner , getHomeBanner , updateHomeBanner } from "../controllers/Homebanner.js";
import multer from 'multer';

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });


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
router.get('/drills/coach/:coachId',  getAllCoachDrills)
router.post('/addDrill', verifyUser, getImgWithVideo, addDrill)
router.get('/drills',  getAllDrills)
router.get('/getAllDrillsbycategory',  getAllDrillsbycategory)

router.get('/drills/:id', getSingleDrill)
router.get('/drillswithcat/:id', getSingleDrillWithCats)
router.put('/update_drill/:id', getImgWithVideo, updateDrill)
router.delete('/drills/:id', deleteDrill)
router.post('/addTraining', verifyUser, getImg, AddTrainings)
router.put('/updateTraining/:id',getImg, UpdateTrainings)
router.put('/updateTrainingDrills/:id', upload.none(), updateTrainingDrills)
router.get('/trainings',  getAllTrainings)
router.post('/addTrainingdrills', verifyUser, AddTrainingsDrills)
router.get('/singletrainings/:id', verifyUser, singleTrainings)
router.get('/singletrainingsdrills/:id', verifyUser, singleTrainingsDrills)
router.delete('/deletetrainings/:id', deletetrainings)
router.post('/addloaderimage', verifyUser,getImg, Addloaderimage)
router.get('/get_loaderimage',  Getloaderimage)
router.put('/updateloaderimage/:id', getImg , updateloaderimage)

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
router.put('/update_coach/:id', updateCoach)
router.delete('/deleteCoaches/:id', deleteCoach)

router.post('/addBlogCat', verifyUser, addBlogCategory)
router.get('/blogCategories', getAllBlogCategories)
router.get('/get_blog_category/:id', getSingleBlogCategory)
router.put('/update_blog_category/:id', updateBlogCategory)
router.delete('/blogCategories/:id', deleteBlogCategory)

router.post('/addBlog', verifyUser, getImg, addBlog)
router.get('/blogs', getAllBlogs)
router.get('/get_blog/:id', getSingleBlog)
router.put('/update_blog/:id', getImg, updateBlog)
router.delete('/blogs/:id', deleteBlog)

router.post('/addHomeBanner', verifyUser, getImg, addHomeBanner)
router.get('/get-home-banner', getHomeBanner)
router.put('/updateHomeBanner/:id', getImg, updateHomeBanner)

router.post('/assigntrainingplan', verifyUser, AssignTrainingPlan)
router.get('/assignTrainingPlans', getAllAssignedTrainings)
router.get('/assignments/:goalieId', getAllAssignedTrainingsByGoalieId)
router.put('/assignments/:id', updateAssignedTrainingsStatus)

// goalie routes
router.get('/banner-content', getHomeBanner)
router.get('/trainings-home/:id', getAllTrainingsHome);
router.get('/training/:id', singleTrainingsDrillDetails);
export default router
