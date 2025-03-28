import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import StudentDashboardNavbar from '../components/dashboardNavbar';
import Navbar from '../components/logged-in-main-navbar';

import './Page.css';
import profilePic from '../assets/gohan-pic.webp';

export default function SDH_yourTutors() {
    /* This sets the current date on the welcome/home page */
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState('');
    const [timeMessage, setTimeMessage] = useState('');
    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentHour = new Date().getHours();
            if (currentHour >= 5 && currentHour < 12) {
                setCurrentTime("Good Morning, ");
                setTimeMessage("Let's start the day off great in your studies!");
            }
            else if (currentHour >= 12 && currentHour < 18) {
                setCurrentTime("Good Afternoon, ");
                setTimeMessage("A good study session happens right after Lunch");
            }
            else {
                setCurrentTime("Good Evening, ");
                setTimeMessage("The night is still young, keep studying!");
            }
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="student-dashboard-container">
            <Navbar />
            <StudentDashboardNavbar />
            <div className="student-dashboard-content">
            </div>
            <Footer />
        </div>
    );
}