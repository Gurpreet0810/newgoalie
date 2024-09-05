import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../src/assests/goalie-logo.png'; // Ensure correct path to logo
import MenuIcon from '@mui/icons-material/Menu';
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
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import GroupIcon from '@mui/icons-material/Group';
import AdjustIcon from '@mui/icons-material/Adjust';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import '../components/style/style.scss'; // Make sure to import your stylesheet
import GroupsIcon from '@mui/icons-material/Groups';

const list = [
    { id: 1, title: 'Calling Sheet', link: '/calling-sheet', icon: <AdjustIcon className='icon_color' /> },
    { id: 2, title: 'Ticket Status Sheet', link: '/ticket-status-sheet', icon: <AdjustIcon className='icon_color' /> },
    { id: 3, title: 'Assigned Assistance Sheet',link: '/assigned-assistance-sheet', icon: <AdjustIcon className='icon_color' /> },
    { id: 4, title: 'Maya Calls Request',link: '/maya-call-request', icon: <AdjustIcon className='icon_color' /> },
    { id: 5, title: 'Maya Message Request',link: '/maya-message-request', icon: <AdjustIcon className='icon_color' /> },
    { id: 7, title: 'Compliance-Box',link: '/compliance-box', icon: <AdjustIcon className='icon_color icon_2' /> },
    { id: 8, title: 'Add New Reason',link: '/add-new-reason', icon: <AdjustIcon className='icon_color icon_2' /> },
];

const listData = [
    { id: 9, title: 'Call Now Sheet', link: '/call-sheet', icon: <AdjustIcon className='icon_color icon_2' /> },
    { id: 10, title: 'Call Records',link: '/call-records', icon: <AdjustIcon className='icon_color icon_2' /> },
    { id: 11, title: 'Queue Call List',link: '/queue-call-list', icon: <AdjustIcon className='icon_color icon_2' /> },
    { id: 12, title: 'In Progress Call',link: '/in-progress-call', icon: <AdjustIcon className='icon_color icon_2' /> },

];

const reportData = [
    { id: 11, title: 'Analytics Reports', link: '/analytics-reports', icon: <AdjustIcon className='icon_color icon_2' /> },
    { id: 12, title: 'Customer Reports',link: '/customer-reports', icon: <AdjustIcon className='icon_color icon_2' /> },
    { id: 13, title: 'M.G.T Reports',link: '/mgt-reports', icon: <AdjustIcon className='icon_color icon_2' /> },
    { id: 14, title: 'Report Call Logs',link: '/report-call-logs', icon: <AdjustIcon className='icon_color icon_2' /> },
    { id: 15, title: 'Report Logs',link: '/report-logs', icon: <AdjustIcon className='icon_color icon_2' /> },
    { id: 16, title: 'Data Reports',link: '/data-reports', icon: <AdjustIcon className='icon_color icon_2' /> },
    { id: 17, title: 'Call Now Report',link: '/call-now-report', icon: <AdjustIcon className='icon_color icon_2' /> },
    { id: 18, title: 'Timing Report',link: '/timing-report', icon: <AdjustIcon className='icon_color icon_2' /> },
];

const Sidebar = ({ setShowSidebar,showSidebar } : any) => {
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [open5, setOpen5] = useState(false);
    const [open6, setOpen6] = useState(false);
    const [showDropDown, setShowDropDown] = useState(false)

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
                        <ListItemText className='title text_title' primary="Profile" />
                    </ListItem>
 {/* My Goalie */}
                <ListItem className='list_child' button onClick={handleClick3}>
                                <ListItemIcon>
                                    <SettingsIcon className='title' />
                                </ListItemIcon>
                                <ListItemText className='title text_title' primary="My Goalie" />
                                {open3 ? <ExpandLess className='title text_title' /> : <ExpandMore className='title text_title' />}
                            </ListItem>
                            <Collapse in={open3} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem component={Link} to="/add_goalie" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <CallIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary="Add Goalie" />
                                    </ListItem>
                                    <ListItem component={Link} to="/list_goalie" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <AddBoxIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary=" Manage Goalie " />
                                    </ListItem>
                                   
                                </List>
                            </Collapse>
 {/* End My Goalie */}

 {/* Drill Category */}
 <ListItem className='list_child' button onClick={handleClick4}>
                                <ListItemIcon>
                                    <SettingsIcon className='title' />
                                </ListItemIcon>
                                <ListItemText className='title text_title' primary="Drill Category" />
                                {open4 ? <ExpandLess className='title text_title' /> : <ExpandMore className='title text_title' />}
                            </ListItem>
                            <Collapse in={open4} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem component={Link} to="/add-drill-cat" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <CallIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary="Add Drill Category" />
                                    </ListItem>
                                    <ListItem component={Link} to="/list-drill-cat" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <AddBoxIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary=" Manage Drill Category " />
                                    </ListItem>
                                   
                                </List>
                            </Collapse>
 {/* End Drill Category */}

 {/* Drill  */}
 <ListItem className='list_child' button onClick={handleClick5}>
                                <ListItemIcon>
                                    <SettingsIcon className='title' />
                                </ListItemIcon>
                                <ListItemText className='title text_title' primary="Drills" />
                                {open5 ? <ExpandLess className='title text_title' /> : <ExpandMore className='title text_title' />}
                            </ListItem>
                            <Collapse in={open5} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem component={Link} to="/users-extension" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <CallIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary="Add Drills" />
                                    </ListItem>
                                    <ListItem component={Link} to="/change-password" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <AddBoxIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary=" Manage Drills " />
                                    </ListItem>
                                   
                                </List>
                            </Collapse>
 {/* End Drill  */}

  {/* Training Plan  */}
  <ListItem className='list_child' button onClick={handleClick6}>
                                <ListItemIcon>
                                    <SettingsIcon className='title' />
                                </ListItemIcon>
                                <ListItemText className='title text_title' primary="Training Plan" />
                                {open6 ? <ExpandLess className='title text_title' /> : <ExpandMore className='title text_title' />}
                            </ListItem>
                            <Collapse in={open6} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem component={Link} to="/users-extension" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <CallIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary="Add Training Plan" />
                                    </ListItem>
                                    <ListItem component={Link} to="/change-password" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <AddBoxIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary=" Manage Training Plan " />
                                    </ListItem>
                                   
                                </List>
                            </Collapse>
 {/* End Training Plan  */}

 {/* Training Plan  */}
 <ListItem className='list_child' button onClick={handleClick2}>
                                <ListItemIcon>
                                    <SettingsIcon className='title' />
                                </ListItemIcon>
                                <ListItemText className='title text_title' primary="Assign Training Plan" />
                                {open2 ? <ExpandLess className='title text_title' /> : <ExpandMore className='title text_title' />}
                            </ListItem>
                            <Collapse in={open2} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem component={Link} to="/users-extension" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <CallIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary="Assign Training Plan" />
                                    </ListItem>
                                    <ListItem component={Link} to="/change-password" sx={{ pl: 2 }} button>
                                        <ListItemIcon>
                                            <AddBoxIcon className='title' />
                                        </ListItemIcon>
                                        <ListItemText className='title' primary=" Manage Assign Training Plan  " />
                                    </ListItem>
                                   
                                </List>
                            </Collapse>
 {/* End Drill  */}

                    {/* <p className='link_title'>Active Customers</p> */}
                    {/* Use Link component from react-router-dom */}
             {/*       <ListItem component={Link} to="/active-customer" className='list_child' button>
                        <ListItemIcon>
                            <GroupsIcon className='title' />
                        </ListItemIcon>
                        <ListItemText className='title text_title' primary="Active Customers" />
                    </ListItem>
                   
                    <ListItem className='list_child' button onClick={handleClick}>
                <ListItemIcon>
                    <SettingsIcon className='title' />
                </ListItemIcon>
                <ListItemText className='title text_title' primary="Settings" />
                {open ? <ExpandLess className='title text_title' /> : <ExpandMore className='title text_title' />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem component={Link} to="/users-extension" sx={{ pl: 2 }} button>
                        <ListItemIcon>
                            <CallIcon className='title' />
                        </ListItemIcon>
                        <ListItemText className='title' primary="Users Extension" />
                    </ListItem>
                    <ListItem component={Link} to="/change-password" sx={{ pl: 2 }} button>
                        <ListItemIcon>
                            <AddBoxIcon className='title' />
                        </ListItemIcon>
                        <ListItemText className='title' primary="Change Password" />
                    </ListItem>
                    <ListItem component={Link} to="/messenger" sx={{ pl: 2 }} button>
                        <ListItemIcon>
                            <MailOutlineIcon className='title' />
                        </ListItemIcon>
                        <ListItemText className='title' primary="Messenger" />
                    </ListItem>
                    <ListItem component={Link} to="/active-customers" sx={{ pl: 2 }} button>
                        <ListItemIcon>
                            <GroupIcon className='title' />
                        </ListItemIcon>
                        <ListItemText className='title' primary="Active Customers" />
                    </ListItem>
                </List>
            </Collapse>
                   
                    {list.map((item) => (
                        <ListItem component={Link} to={item.link} key={item.id} button>
                            {item.icon}
                            <ListItemText className='title text_title' primary={item.title} />
                        </ListItem>
                    ))}
                  
                    {listData.map((item) => (
                        <ListItem component={Link} to={item.link} key={item.id} button>
                            {item.icon}
                            <ListItemText className='title text_title' primary={item.title} />
                        </ListItem>
                    ))}
                </List>
               
                <ListItem className='list_child' button onClick={handleClick2}>
                <ListItemIcon>
                    <CalendarMonthIcon className='title' />
                </ListItemIcon>
                <ListItemText className='title text_title' primary="Maya Report" />
                {open2 ? <ExpandLess className='title text_title' /> : <ExpandMore className='title text_title' />}
            </ListItem>
            <Collapse in={open2} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {reportData.map((item) => (
                        <ListItem component={Link} key={item.id} to={item.link} sx={{ pl: 2 }} button>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText className='title' primary={item.title} />
                        </ListItem>
                    ))}
                </List>
            </Collapse> */}

<ListItem component={Link} to="/" className='list_child' button>
                        <ListItemIcon>
                            <DashboardIcon className='title' />
                        </ListItemIcon>
                        <ListItemText className='title text_title' primary="Logout" />
                    </ListItem>
             </List>
            </div>
        </div>
    );
};

export default Sidebar;
