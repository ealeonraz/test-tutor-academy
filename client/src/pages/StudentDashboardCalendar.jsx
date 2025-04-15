// StudentDashboardCalendar.jsx
import React from 'react';
import StudentDashboardNavbar from '../components/DashboardNavbar.jsx';
import Calendar from '../components/Calendar';
import './StudentDashboardCalendar.css';

export default function StudentDashboardCalendar() {
  return (
    <div className="dashboard-page">
      <StudentDashboardNavbar />
      <div className="dashboard-content">
        {/* Header Section */}
        <div className="header-section">
          <h1>Your Calendar</h1>
          <p>
            Manage your tutoring sessions and view upcoming appointments,
            notifications, and more.
          </p>
        </div>

        {/* Main Content Area: Sidebar + Calendar */}
        <div className="main-content">
          {/* Sidebar with widgets */}
          <div className="sidebar">
            <div className="widget upcoming-appointments">
              <h2>Upcoming Appointments</h2>
              <ul>
                <li>Math Tutoring - Apr 14, 10:00 AM</li>
                <li>Physics Session - Apr 16, 2:00 PM</li>
                <li>Chemistry - Apr 18, 11:00 AM</li>
              </ul>
            </div>
            <div className="widget notifications">
              <h2>Notifications</h2>
              <ul>
                <li>You have 2 new messages.</li>
                <li>Feedback pending for your last session.</li>
                <li>New event: Career Webinar tomorrow.</li>
              </ul>
            </div>
          </div>

          {/* Calendar Column */}
          <div className="calendar-wrapper">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
}
