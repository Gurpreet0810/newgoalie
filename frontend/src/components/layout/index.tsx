import { Outlet, useLocation } from "react-router"
import HeaderPage from "../header";
import Sidebar from "../../sidebar";
import { useState } from "react";


const Layout = () => {
    const location = useLocation();
    const [showSidebar , setShowSidebar] = useState(true)

    const hideHeaderPaths = ['/login'];



    return (
      <div className="layout_container container-fluid">
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