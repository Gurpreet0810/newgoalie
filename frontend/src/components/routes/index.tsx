import { createBrowserRouter } from 'react-router-dom';
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
import ProtectedRoute from './protectedRoute';
import ComplianceBox from '../complianceBox';
import ComplaintReason from '../complianceBox/reason';
import CheckScreen from '../screen';
import AddDrillCategory from '../login/add_drill_cat';
import ListDrillCategory from '../login/listDrillCategory';
import EditDrillCategory from '../login/editDrillCategory';

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
            path: 'profile',
            element: <Profile />, // Displayed within Layout
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
            path: 'compliance-box',
            element: <ComplianceBox />, // Displayed within Layout
          },
          {
            path: 'add-new-reason',
            element: <ComplaintReason />, // Displayed within Layout
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
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />, // No header here
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
