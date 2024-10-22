import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../src/assests/goalie-logo.png'; // Ensure correct path to logo
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import CallIcon from '@mui/icons-material/Call';
import AddBoxIcon from '@mui/icons-material/AddBox';
import BallotIcon from '@mui/icons-material/Ballot';
import ArticleIcon from '@mui/icons-material/Article';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import GroupIcon from '@mui/icons-material/Group';
import AdjustIcon from '@mui/icons-material/Adjust';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import '../components/style/style.scss'; // Make sure to import your stylesheet
import GroupsIcon from '@mui/icons-material/Groups';
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next'



const Sidebar = ({ setShowSidebar,showSidebar } : any) => {
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [open5, setOpen5] = useState(false);
    const [open6, setOpen6] = useState(false);
    const [showDropDown, setShowDropDown] = useState(false)
    // Get user info from state
    const userInfo = useSelector((state: any) => state.user.userInfo);
    const { t, i18n } = useTranslation();
    // Check if the user has a superadmin role
    const isSuperAdmin = userInfo && userInfo[0]?.userDetails?.roles.includes("superadmin");
    const isCoach = userInfo && userInfo[0]?.userDetails?.roles.includes("coach");
    const isGoalie = userInfo && userInfo[0]?.userDetails?.roles.includes("goalie");

    // Don't render sidebar if user is goalie
    if (isGoalie) {
        return null;
    }

    const handleClick = () => {
        setOpen(!open);
    };
    
    const handleClick2 = () => {
        setOpen2(!open2);
    };
    const handleClick3 = () => {
        setOpen3(!open3);
    };

    const handleClick4 = () => {
        setOpen4(!open4);
    };

    const handleClick5 = () => {
        setOpen5(!open5);
    };

    const handleClick6 = () => {
        setOpen6(!open6);
    };

const hideSibar = () => {
    setShowSidebar(!showSidebar)
}


    return (
        <div className={
            showSidebar ? "side_container": 
            "side_container side_hide_container"
        }>
            <div className="upper_sidebar">
                <img width={'150px'} src={logo} alt="Logo" />
                <p onClick={hideSibar}>
                    < MenuIcon />
                </p>
            </div>
            <div className="lower_sidebar">
                <List
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    {/* <p className='link_title'>Dashboard</p> */}
                   <ListItem component={Link} to="/profile" className='list_child' button>
                        <ListItemIcon>
                            <DashboardIcon className='title' />
                        </ListItemIcon>
                        <ListItemText className='title text_title' primary={t('profile')} />
                    </ListItem>

                    {/* menu for super admin start */}
                    {isSuperAdmin && (
                    <>
                    <ListItem className='list_child' button onClick={handleClick3}>
                                <ListItemIcon>
                                    <PersonIcon className='title' />
                                </ListItemIcon>
                                <ListItemText className='title text_title' primary={t('coaches')} />
                                {open3 ? <ExpandLess className='title text_title' /> : <ExpandMore className='title text_title' />}
                            </ListItem>
                            <Collapse in={open3} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem component={Link} to="/add-coach" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <AddBoxIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary={t('addcoaches')} />
                                    </ListItem>
                                    <ListItem component={Link} to="/list-coach" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <BallotIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary={t('managecoaches')}  />
                                    </ListItem>
                                   
                                </List>
                    </Collapse>

                    <ListItem className='list_child' button onClick={handleClick4}>
                                <ListItemIcon>
                                    <CategoryIcon className='title' />
                                </ListItemIcon>
                                <ListItemText className='title text_title' primary={t('Blogcat')} />
                                {open4 ? <ExpandLess className='title text_title' /> : <ExpandMore className='title text_title' />}
                            </ListItem>
                            <Collapse in={open4} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem component={Link} to="/add-blog-category" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <AddBoxIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary={t('addblogcat')} />
                                    </ListItem>
                                    <ListItem component={Link} to="/list-blog-category" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <BallotIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary={t('Manage_Blog_cate')} />
                                    </ListItem>
                                   
                                </List>
                            </Collapse>

                            <ListItem className='list_child' button onClick={handleClick5}>
                                <ListItemIcon>
                                    <ArticleIcon className='title' />
                                </ListItemIcon>
                                <ListItemText className='title text_title' primary={t('Blogs')} />
                                {open5 ? <ExpandLess className='title text_title' /> : <ExpandMore className='title text_title' />}
                            </ListItem>
                            <Collapse in={open5} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem component={Link} to="/add-blog" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <AddBoxIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary={t('addblog')} />
                                    </ListItem>
                                    <ListItem component={Link} to="/list-blog" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <BallotIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary={t('Manage_Blog')} />
                                    </ListItem>
                                   
                                </List>
                            </Collapse>

                    <ListItem component={Link} to="/coach-drills" className='list_child' button>
                        <ListItemIcon>
                            <AutoAwesomeMosaicIcon className='title' />
                        </ListItemIcon>
                        <ListItemText className='title text_title' primary={t('drills')} />
                    </ListItem>

                   
                    <ListItem className='list_child' component={Link} to="/loader/create/">
                                <ListItemIcon>
                                    <ArticleIcon className='title' />
                                </ListItemIcon>
                                <ListItemText className='title text_title' primary={t('loaderimage')} />
                            </ListItem>
                            <ListItem component={Link} to="/home-banner" className='list_child' button>
                        <ListItemIcon>
                            <AutoAwesomeMosaicIcon className='title' />
                        </ListItemIcon>
                        <ListItemText className='title text_title' primary={t('homebanner')} />
                    </ListItem>
                            </>
                        )}
                    {/* menu for super admin end */}
                    {isCoach && (
                    <> 
            {/* My Goalie */}
                <ListItem className='list_child' button onClick={handleClick3}>
                                <ListItemIcon>
                                    <PersonIcon className='title' />
                                </ListItemIcon>
                                <ListItemText className='title text_title' primary={t('my_goalies')} />
                                {open3 ? <ExpandLess className='title text_title' /> : <ExpandMore className='title text_title' />}
                            </ListItem>
                            <Collapse in={open3} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem component={Link} to="/add_goalie" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <AddBoxIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary={t('add_goalie')} />
                                    </ListItem>
                                    <ListItem component={Link} to="/list_goalie" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <BallotIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary={t('manage_goalies')} />
                                    </ListItem>
                                   
                                </List>
                            </Collapse>
 {/* End My Goalie */}

 {/* Drill Category */}
 <ListItem className='list_child' button onClick={handleClick4}>
                                <ListItemIcon>
                                    <CategoryIcon className='title' />
                                </ListItemIcon>
                                <ListItemText className='title text_title' primary={t('drills_cat')} />
                                {open4 ? <ExpandLess className='title text_title' /> : <ExpandMore className='title text_title' />}
                            </ListItem>
                            <Collapse in={open4} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem component={Link} to="/add-drill-cat" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <AddBoxIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary={t('add_drills_cat')} />
                                    </ListItem>
                                    <ListItem component={Link} to="/list-drill-cat" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <BallotIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary={t('manage_drills_cat')} />
                                    </ListItem>
                                   
                                </List>
                            </Collapse>
 {/* End Drill Category */}

 {/* Drill  */}
 <ListItem className='list_child' button onClick={handleClick5}>
                                <ListItemIcon>
                                    <AutoAwesomeMosaicIcon className='title' />
                                </ListItemIcon>
                                <ListItemText className='title text_title' primary={t('drills')}  />
                                {open5 ? <ExpandLess className='title text_title' /> : <ExpandMore className='title text_title' />}
                            </ListItem>
                            <Collapse in={open5} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem component={Link} to="/add-drill" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <AddBoxIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary={t('add_drills')}     />
                                    </ListItem>
                                    <ListItem component={Link} to="/list-drill" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <BallotIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary={t('manage_drills')} />
                                    </ListItem>
                                   
                                </List>
                            </Collapse>
 {/* End Drill  */}

  {/* Training Plan  */}
  <ListItem className='list_child' button onClick={handleClick6}>
                                <ListItemIcon>
                                    <AccountTreeIcon className='title' />
                                </ListItemIcon>
                                <ListItemText className='title text_title' primary={t('traning')} />
                                {open6 ? <ExpandLess className='title text_title' /> : <ExpandMore className='title text_title' />}
                            </ListItem>
                            <Collapse in={open6} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem component={Link} to="/add-training" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <AddBoxIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary={t('add_traning')} />
                                    </ListItem>
                                    <ListItem component={Link} to="/manage-training" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <BallotIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary={t('manage_traning')} />
                                    </ListItem>
                                   
                                </List>
                            </Collapse> 
 {/* End Training Plan */}

 {/* Training Plan  */}
 <ListItem className='list_child' button onClick={handleClick2}>
                                <ListItemIcon>
                                    <PeopleAltIcon className='title' />
                                </ListItemIcon>
                                <ListItemText className='title text_title' primary="Assign Training Plan" />
                                {open2 ? <ExpandLess className='title text_title' /> : <ExpandMore className='title text_title' />}
                            </ListItem>
                            <Collapse in={open2} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem component={Link} to="/assign-training-plan" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <AddBoxIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary="Assign Training Plan" />
                                    </ListItem>
                                    <ListItem component={Link} to="/manage-assign-training-plan" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <BallotIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary=" Manage Assign Training Plan  " />
                                    </ListItem>
                                   
                                </List>
                            </Collapse>
 {/* End Drill  */}
 </>
                )}
<ListItem component={Link} to="/logout" className='list_child' button>
                        <ListItemIcon>
                            <LogoutIcon className='title' />
                        </ListItemIcon>
                        <ListItemText className='title text_title' primary={t('logout')} />
                    </ListItem>
             </List>
            </div>
        </div>
    );
};

export default Sidebar;
