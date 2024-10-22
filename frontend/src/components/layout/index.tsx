import { Outlet, useLocation } from "react-router"
import HeaderPage from "../header";
import Sidebar from "../../sidebar";
import bglogo from '../../assests/bg.png'
import { useSelector } from "react-redux";
import { useState } from "react";


const Layout = () => {
    const location = useLocation();
    const [showSidebar , setShowSidebar] = useState(true)
    const userInfo = useSelector((state: any) => state.user.userInfo);
    const isGoalie = userInfo && userInfo[0]?.userDetails?.roles.includes("goalie");
    if (isGoalie) {
      const goalie_container = 'goalie_container';
  }

    const hideHeaderPaths = ['/login'];

    return (
      <div className={`layout_container container-fluid ${isGoalie ? 'goalie_container' : ''}`} style={{ backgroundImage: isGoalie ? `url(${bglogo})` : 'none' }}>
      <div className={
        showSidebar ? "sidebar_layout" : "sidebar_layout hider_siderbar_layout"
      }>
      <Sidebar showSidebar={showSidebar}  setShowSidebar={setShowSidebar}/>

      </div>
      <main className="layout_section">
      {!hideHeaderPaths.includes(location.pathname) && <HeaderPage />}
        <Outlet />
      </main>
    </div>
    )
}

export default Layout