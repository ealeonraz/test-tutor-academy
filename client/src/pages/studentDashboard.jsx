import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import StudentDashboardNavbar from '../components/dashboardNavbar';
import Navbar from '../components/logged-in-main-navbar';
import { useLocation } from 'react-router-dom';

import './Page.css';
import profilePic from '../assets/gohan-pic.webp';

function StudentDashboardHome() {
    const location = useLocation();
    const user = location.state?.user; // Retrieve user info from state

    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState('');
    const [timeMessage, setTimeMessage] = useState('');

    useEffect(() => {
        if (!user) {
            console.error("No user information found");
        }

        const intervalId = setInterval(() => {
            const currentHour = new Date().getHours();
            if (currentHour >= 5 && currentHour < 12) {
                setCurrentTime("Good Morning, ");
                setTimeMessage("Let's start the day off great in your studies!");
            } else if (currentHour >= 12 && currentHour < 18) {
                setCurrentTime("Good Afternoon, ");
                setTimeMessage("A good study session happens right after Lunch");
            } else {
                setCurrentTime("Good Evening, ");
                setTimeMessage("The night is still young, keep studying!");
            }
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, [user]);

    return (
        <div className="student-dashboard-container">
            <Navbar />
            <StudentDashboardNavbar />
            <div className="student-dashboard-content">
                <div className="student-welcome-box">
                    <div className="date">
                        <p>{currentDate.toLocaleDateString()}</p>
                    </div>
                    <div className="name-message">
                        <h1>{currentTime}{user?.firstname || "Student"}</h1>
                        <h4>{timeMessage}</h4>
                    </div>
                    <div className="user-picture">
                        <img src={profilePic} alt="Profile" />
                    </div>
                </div>

                <div className="typewriter-container">
                    <p className="typwriter-text">What are we searching for this time?</p>
                </div>

                <div className="search-bar-container">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search for tutors, subjects, or topics..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                console.log("Search submitted:", e.target.value);
                                // Add your search logic here
                            }
                        }}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default StudentDashboardHome;