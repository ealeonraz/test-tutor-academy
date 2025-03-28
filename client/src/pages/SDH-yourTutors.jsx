import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import StudentDashboardNavbar from '../components/dashboardNavbar';
import Navbar from '../components/logged-in-main-navbar';

import './Page.css';
import profilePic from '../assets/gohan-pic.webp';

export default function SDH_yourTutors() {
    const [tutors, setTutors] = useState([])

    useEffect(() => {
        async function fetchTutors() {
            try {
                const reponse = await fetch('/api/tutors');
                const data = await Response.json();
            } catch (error) {
                console.error('Error fetching the tutors:', error);
            }
        }

        fetchTutors();
    }, []);

    return (
        <div className="student-dashboard-container">
            <Navbar />
            <StudentDashboardNavbar />
            <div className="student-dashboard-content">
                <div className="your-tutors-box">
                    <div className="tutors-card-group">
                        {tutors.length > 0 ? (tutors.map((tutor, index) => (
                            <button key={index} className="tutors-card">
                                {tutor.name} { /* Displays the tutor's name */}
                            </button>
                        ))
                        ) : (
                            <p> No tutors booked yet</p> // Message if no tutors are found
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}