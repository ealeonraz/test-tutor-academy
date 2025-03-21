import { Outlet } from "react-router-dom";
import StudentDashboardNavbar from "./dashboardNavbar";

import "./dashboardNavbar.css"

function Layout(){
    return(
        <div className="layout-container">
            <StudentDashboardNavbar />
            <Outlet />
        </div>
    );
}
export default Layout;