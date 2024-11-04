import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useEffect, useRef } from "react";
import Loader from "react-js-loader";
import '../style/style.scss';
import logo from '../../assests/logo-white.png';
import uicon from '../../assests/u-icon.jpg';
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

    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const isSuperAdmin = userInfo && userInfo[0]?.userDetails?.roles.includes("superadmin");
    const role = userInfo && userInfo[0]?.userDetails?.roles;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onConfirm = async () => {
        try {
            let logoutResponse = await userLogout(dispatch);
            // console.log('Header logout response:', logoutResponse);
            if (logoutResponse.statusCode === 200) {
                localStorage.removeItem('token');
                toast.success(logoutResponse.message, { autoClose: 1000 });
                navigate('/login');
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleLogout = () => {
        const confirm = window.confirm('Are you sure you want to logout?');
        if (confirm) {
            onConfirm();
        }
    };

    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: 'en' | 'fr') => {
        i18n.changeLanguage(lng);
        setIsActive(lng);
    };

    return (
        <>
        {loader && <Loader type="spinner-default" bgColor={"#000"} size={100} />}
        {role?.includes("superadmin") || role?.includes("coach") ? (
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
) : (
    <header className="different_header">
    <div id="sticky-header" className="menu-area gerow-menu-has-showing">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <nav className="navbar navbar-expand-lg">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="/goalie-home/">
                                <img src={logo} width="140px" alt="Logo" />
                            </a>

                            <div className="collapse navbar-collapse" id="navbarScroll">
                                <ul className="navbar-nav navbar-nav-scroll m-auto">
                                    <li className="nav-item">
                                        <NavLink 
                                            to="/goalie-home/" 
                                            className={({ isActive }) => 
                                                isActive ? "nav-link active" : "nav-link"
                                            }
                                        >
                                            {t('dashboard_home')}
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink 
                                            to="/goalie/view-all-trainings/" 
                                            className={({ isActive }) => 
                                                isActive ? "nav-link active" : "nav-link"
                                            }
                                        >
                                             {t('mytraining')}
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink 
                                            to="/goalie/view-all-blogs/" 
                                            className={({ isActive }) => 
                                                isActive ? "nav-link active" : "nav-link"
                                            }
                                        >
                                            {t('latestnews')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="user">
                                {/* <div className="language" style={{ margin: 'auto' }}>
                                    <select className="language form-select" style={{ width: '108px' }}>
                                        <option value="/goalie/view-trainings/">English</option>
                                        <option value="/goalie/view-trainings/" selected>French</option>
                                    </select>
                                </div> */}
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
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={uicon} alt="User" />
                                    </button>
                                    <ul className="dropdown-menu">
                                        <a className="dropdown-item" href="/goalie-profile/">{t('myprofile')}</a>
                                        <a className="dropdown-item" href="/logout/">{t('logout')}</a>   
                                    </ul>
                                </div>

                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"><i className="bi bi-list"></i></span>
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</header>
)}

        </>
    );
};

export default HeaderPage;
