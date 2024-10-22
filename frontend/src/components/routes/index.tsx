import { createBrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserService from '../services/userServices';

import ProtectedRoute from './protectedRoute';
import Layout from '../layout';
import HomeSection, { HomeSection1, HomeSection2 } from '../home';
import Login from '../login/login';
import Profile from '../login/profile';
import SignUp from '../login/signUp';
import Addgoalie from '../login/add_goalie';
import ListGoalie from  '../login/list_goalie';
import EditGoalie from '../login/EditGoalie';
import ForgotPassword from '../login/forgot-password';
import ResetPassword from '../login/reset-password';
import ComplianceBox from '../complianceBox';
import ComplaintReason from '../complianceBox/reason';
import CheckScreen from '../screen';
import AddDrillCategory from '../login/add_drill_cat';
import ListDrillCategory from '../login/listDrillCategory';
import EditDrillCategory from '../login/editDrillCategory';
import AddDrill from '../login/addDrill';
import ListDrill from '../login/listDrill';
import EditDrill from '../login/editDrill';
import AddTraining from '../login/addTraining';
import ListTrainings from '../login/listtraining';
import EditTraining from '../login/editTraining';
import Loaders from '../login/loader';
// for superadmin
import AddCoach from '../login/signUp';
import ListCoach from '../login/listCoach';
import EditCoach from '../login/editCoach';

import BlogCategory from '../login/blogCategory';
import ListBlogCategory from '../login/listBlogCategory';
import EditBlogCategory from '../login/editBlogCategory';

import AddBlog from '../login/addBlog';
import ListBlog from '../login/listBlog';
import EditBlog from '../login/editBlog';

import CoachDrills from '../login/coachDrills';
import DrillsCoach from '../login/drillsCoach';

import AssignTrainingPlan from '../login/assignTrainingPlan';
import ListAssignTrainingPlan from '../login/listAssignTrainingPlan';
import EditAssignTrainingPlan from '../login/editAssignTrainingPlan';
import ViewAssignTrainingPlan from '../login/viewAssignTrainingPlan';

import GoalieHome from '../login/goalie/home';
import HomeBanner from '../login/homeBanner';
import GoalieAllTrainings from '../login/goalie/goalieAllTrainings';
import GoalieTraining from '../login/goalie/goalieTraining';
import GoalieAllBlogs from '../login/goalie/goalieAllBlogs';
import GoalieSingleBlog from '../login/goalie/singleBlog';
import GoalieProfile from '../login/goalie/goalieProfile';

// Logout component
const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const logout = async () => {
      try {
        const res: any = await UserService.logoutUser();
        localStorage.removeItem('token');
        navigate('/login');
      } catch (error) {
        console.error('Logout failed', error);
      }
    };
    logout();
  }, [navigate]);
  return null;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />, // Ensure Layout wraps all child routes
        children: [
          {
            index: true, // This will render HomeSection at the root path
            element: <HomeSection />,
          },
          {
            path: 'dashboard',
            element: <HomeSection1 />, // Displayed within Layout
          },
          {
            path: 'coach-drills',
            element: <CoachDrills />, // Displayed within Layout
          },
          {
            path: '/coach/drills/:coachId',
            element: <DrillsCoach />, // Displayed within Layout
          },
          {
            path: 'add-coach',
            element: <AddCoach />, // Displayed within Layout
          },
          {
            path: 'list-coach',
            element: <ListCoach />, // Displayed within Layout
          },
          {
            path: '/coaches/edit/:id',
            element: <EditCoach />, // Displayed within Layout
          },
          {
            path: 'add-blog-category',
            element: <BlogCategory />, // Displayed within Layout
          },
          {
            path: 'list-blog-category',
            element: <ListBlogCategory />, // Displayed within Layout
          },
          {
            path: '/blog-categories/edit/:id',
            element: <EditBlogCategory />, // Displayed within Layout
          },
          {
            path: 'add-blog',
            element: <AddBlog />, // Displayed within Layout
          },
          {
            path: 'list-blog',
            element: <ListBlog />, // Displayed within Layout
          },
          {
            path: '/blog/edit/:id',
            element: <EditBlog />, // Displayed within Layout
          },
          {
            path: 'profile',
            element: <Profile />, // Displayed within Layout
          },
          {
            path: '/loader/create',
            element: <Loaders />, // Displayed within Layout
          },
          {
            path: 'home-banner',
            element: <HomeBanner />, // Displayed within Layout
          },
          {
            path: 'add-drill-cat',
            element: <AddDrillCategory />, // Displayed within Layout
          },
          {
            path: 'list-drill-cat',
            element: <ListDrillCategory />, // Displayed within Layout
          },
          {
            path: '/drill-categories/edit/:id',
            element: <EditDrillCategory />, 
          },
          {
            path: '/list_goalie',
            element: <ListGoalie />,
          },
          {
            path: 'add-drill',
            element: <AddDrill />,
          },
          {
            path: 'list-drill',
            element: <ListDrill />, // Displayed within Layout
          },
          {
            path: '/drills/edit/:id',
            element: <EditDrill />, 
          },
          {
            path: 'customer-reports',
            element: <ComplaintReason />, // Displayed within Layout
          },
          {
            path: 'add_goalie',
            element: <Addgoalie />, 
          },
          {
            path: '/goalies/edit/:id',
            element: <EditGoalie />, 
          },
          {
            path: 'add-training',
            element: <AddTraining />, 
          },
          {
            path: '/edit-training/:trainingId',
            element: <EditTraining />, 
          },
          {
            path: '/manage-training',
            element: <ListTrainings />, 
          },
          {
            path: 'assign-training-plan',
            element: <AssignTrainingPlan />, 
          },
          {
            path: 'manage-assign-training-plan',
            element: <ListAssignTrainingPlan />, 
          },
          {
            path: '/edit-assigned-training-plan/:id',
            element: <EditAssignTrainingPlan />, 
          },
          {
            path: '/view-assigned-training-plan/:id',
            element: <ViewAssignTrainingPlan />, 
          },
          {
            path: 'goalie-home',
            element: <GoalieHome />, 
          },
          {
            path: '/goalie/view-all-trainings',
            element: <GoalieAllTrainings />, 
          },
          {
            path: '/goalie/view-training/:trainingPlanId',
            element: <GoalieTraining />, 
          },
          {
            path: '/goalie/view-all-blogs',
            element: <GoalieAllBlogs />, 
          },
          {
            path: '/goalie/blog/:id',
            element: <GoalieSingleBlog />, 
          },
          {
            path: '/goalie-profile/',
            element: <GoalieProfile />, 
          }          
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />, // No header here
  },
  {
    path: '/logout',
    element: <Logout />, // No header here
  },
  {
    path: '/sign-up',
    element: <SignUp />, // No header here
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />,
  },
  {
    path: 'check-screen',
    element: <CheckScreen />, // Displayed within Layout
  },
  {
    path: '*',
    element: <Layout />, // Optional: You can customize this route
  },
]);

export default router;
export { Logout };
