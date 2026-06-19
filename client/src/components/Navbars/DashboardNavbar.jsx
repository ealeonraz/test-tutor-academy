import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile } from '../../api/auth';

export default function DashboardNavbar() {
  const navigate = useNavigate();

  // State for storing user info (email, role)
  const [userInfo, setUserInfo] = useState({
    email: "",
    role: "",
    roleName:"",
  });

  // Fetch user info for the current session
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getMyProfile();
        if (!data) return;
        setUserInfo({
          email: data.email,
          role: data.role || 'guest',
          roleName: data.role,
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // Get the user role (default to 'guest' if not available)
  const userRole = userInfo.role
  const roleName = userInfo.roleName


  // Handle navigation based on user role
  const sendToHome = () => navigate(`/${roleName}-dashboard/`);
  const sendToYourTutors = () => navigate(`/${roleName}-dashboard/your-tutors`);
  const sendToYourStudents = () => navigate(`/${roleName}-dashboard/students`);
  const sendToCalendar = () => navigate(`/${roleName}-dashboard/calendar`);
  const sendToAppointments = () => navigate(`/${roleName}-dashboard/appointments`);
  const sendToEvents = () => navigate(`/${roleName}-dashboard/events`);
  const sendToManageTutors = () => navigate(`/${roleName}-dashboard/tutors`);
  const sendToPayroll = () => navigate(`/tutor-dashboard/payroll`)


  // Define different navbar items based on role
  const renderNavbar = () => {
    switch (userRole) {
      case 'student':
        return (
          <>
            <div className="dashboard-button" onClick={sendToYourTutors}>Your Tutors</div>
            <div className="dashboard-button" onClick={sendToAppointments}>Appointments</div>
            <div className="dashboard-button" onClick={sendToHome}>Home</div>
            <div className="dashboard-button" onClick={sendToCalendar}>Calendar</div>
            <div className="dashboard-button" onClick={sendToEvents}>Events</div>
          </>
        );
      case 'tutor':
        return (
          <>
            <div className="dashboard-button" onClick={sendToYourStudents}>My Students</div>
            <div className="dashboard-button" onClick={sendToAppointments}>View Appointments</div>
            <div className="dashboard-button" onClick={sendToHome}>Home</div>
            <div className="dashboard-button" onClick={sendToCalendar}>My Calendar</div>
            <div className="dashboard-button" onClick={sendToPayroll}>Payroll</div>
          </>
        );
      case 'admin':
        return (
          <>
            <div className="dashboard-button" onClick={sendToPayroll}>Payroll</div>
            <div className="dashboard-button" onClick={sendToManageTutors}>Manage Tutors</div>
            <div className="dashboard-button" onClick={sendToHome}>Dashboard</div>
            <div className="dashboard-button" onClick={sendToCalendar}>Manage Students</div>
            <div className="dashboard-button" onClick={sendToEvents}>Manage Events</div>
          </>
        );
      default:
        return (
          <>
            <div className="dashboard-button" onClick={sendToHome}>Home</div>
          </>
        );
    }
  };

  return (
    <div className="dashboard-nav-main">
      <div className="dashboard-buttons-group">
        {renderNavbar()}
      </div>
    </div>
  );
}
