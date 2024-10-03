import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useEffect, useRef } from "react";
import Loader from "react-js-loader";
import '../style/style.scss';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsIcon from '@mui/icons-material/Settings';
import profileLogo from '../../assests/admin.jpg';
import { userLogout } from "../store/loginSlice";
import { toast } from "react-toastify";
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

interface RootState {
    user: {
        userInfo: Array<{ userDetails: { roles: string[] } }>;
    };
}

const HeaderPage: React.FC = () => {
    const searchRef = useRef<HTMLInputElement | null>(null); // Ref for the search input and results container
    const [loader, setLoader] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isActive, setIsActive] = useState<'en' | 'fr'>('en'); // Track active language button

    // Get user info from state
    const userInfo = useSelector((state: RootState) => state.user.userInfo);

    // Check if the user has a superadmin role
    const isSuperAdmin = userInfo && userInfo[0]?.userDetails?.roles.includes("superadmin");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onConfirm = async () => {
        try {
            // Logout function
            let logoutResponse = await userLogout(dispatch);
            console.log('Header logout response:', logoutResponse);
            if (logoutResponse.statusCode === 200) {
                localStorage.removeItem('token');
                toast.success(logoutResponse.message, { autoClose: 1000 });
                navigate('/login'); // Redirect to login page after logout
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleLogout = () => {
        // Handle logout action with confirmation
        const confirm = window.confirm('Are you sure you want to logout?');
        if (confirm) {
            onConfirm();
        }
    };

    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: 'en' | 'fr') => {
        i18n.changeLanguage(lng);
        setIsActive(lng); // Set active language state
    };

    return (
        <>
            {loader && <Loader type="spinner-default" bgColor={"#000"} size={100} />}
            <header className={`headerTag ${showMenu ? '' : 'new_header_class'}`}>
                <div className="left_sider">
                    {isSuperAdmin && <p>Logged in as Superadmin</p>}
                </div>
                <div className="center_sider">
                    <button
                        className={isActive === 'en' ? 'active' : ''}
                        onClick={() => changeLanguage('en')}
                    >
                        English
                    </button>
                    <button
                        className={isActive === 'fr' ? 'active' : ''}
                        onClick={() => changeLanguage('fr')}
                    >
                        Français
                    </button>
                </div>
                <nav>
                    <ul>
                        <li className="icons">
                            <NotificationsNoneIcon />
                        </li>
                        <li className="profile_logo">
                            <img src={profileLogo} alt="Profile" />
                        </li>
                        <li onClick={handleLogout} className="icons">
                            <SettingsIcon />
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    );
};

export default HeaderPage;
