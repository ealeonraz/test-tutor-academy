import React from 'react';
import Footer from '../components/Footer';
import StudentDashboardNavbar from '../components/dashboardNavbar';
import Navbar from '../components/Navbar';

import './studentDashboard.css';

function StudentDashboardHome(){
    return(
        <div className= "student-dashboard-container">
            <Navbar />
            <StudentDashboardNavbar />
            <div className = "student-dashboard-content">
                <div className ="student-welcome-box">
                    
                </div>
                <h1>Welcoming the user to their dashboard</h1>
            </div>
            <Footer />
        </div>
    );
}

export default StudentDashboardHome;