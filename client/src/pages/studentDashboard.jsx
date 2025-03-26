import React, {useState, useEffect} from 'react';
import Footer from '../components/Footer';
import StudentDashboardNavbar from '../components/dashboardNavbar';
import Navbar from '../components/logged-in-main-navbar/logged-in-main-navbar';

import './studentDashboard.css';

function StudentDashboardHome(){
    /* This sets the current date on the welcome/home page */
    const [currentDate, setCurrentDate] = useState(new Date());
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return(
        <div className= "student-dashboard-container">
            <Navbar />
            <StudentDashboardNavbar />
            <div className = "student-dashboard-content">
                <div className ="student-welcome-box">
                    <p>{currentDate.toLocaleDateString()}</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default StudentDashboardHome;