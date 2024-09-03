import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useEffect, useRef } from "react";
import Loader from "react-js-loader";
import '../style/style.scss'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsIcon from '@mui/icons-material/Settings';
import profileLogo from '../../assests/admin.jpg'
import TuneIcon from '@mui/icons-material/Tune';
import { userLogout } from "../store/loginSlice";
import { toast } from "react-toastify";

interface userParams {
    page : number,
    limit: number,
    name : '' 
}

const HeaderPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const searchRef = useRef(null); // Ref for the search input and results container
    const [loader, setLoader] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showList, setShowList] = useState(false);

    const onConfirm = async () => {
        // Logout function
        let logoutResponse = await userLogout(dispatch);
        console.log('hreader logout response', logoutResponse);
        
        if (logoutResponse.statusCode == 200) {
          localStorage.removeItem('token');
          toast.success(logoutResponse.message, {
            autoClose: 1000,
          });
          navigate('/login');
        }
      };

      
    const handleLogout = () => {
        // Handle logout action
        const confirm = window.confirm('Are you sure you want to logout?');
        if (confirm) {
          onConfirm();
        }
      };
    


    return (
        <header className={`headerTag ${showMenu ? '' : 'new_header_class'}`}>
            <div className="left_sider">
                <input type="text" className="search_bar"  placeholder="Search By Employee"/>
                <p  className="icons filter">
                    <TuneIcon/>
                </p>
            </div>
            <nav>
              <ul>
                <li className="icons">
                   <NotificationsNoneIcon/>
                </li>
                <li className="profile_logo">
                   <img src={profileLogo} alt="" />
                </li>
                <li 
                onClick={handleLogout}
                className="icons">
                   <SettingsIcon/>
                </li>
              </ul>
            </nav>
        </header>
    );
}

export default HeaderPage;
