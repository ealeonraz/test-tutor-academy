import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginOverlayButton from "../components/LoginOverlayButton";
import RegisterOverlayButton from "../components/RegisterOverlayButton";
import "./Page.css";
import { useNavigate } from 'react-router-dom';


/**
 * Home Component
 * This component serves as the homepage layout.
 * It includes a navigation bar, main content, and footer.
 * On load, if a valid JWT exists and the role is "student", the user is navigated to the student dashboard.
 */

function parseJwt(token) {
  try {
    const base64url = token.split(".")[1];
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse JWT", error);
    return null;
  }
}

function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const closePopup = () => {
    setShowPopup(false);
  };

  // Check if the user is logged in and redirect accordingly
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("I am here");
    if (token) {
      try {
        const decoded = parseJwt(token);
        if (decoded.role === "student") {
          console.log(decoded.role)
          navigate("/");
        } else {
          console.error("Unknown User role:", decoded.role);
          navigate("/studentDashboard/");
        }
      } catch (error) {
        console.error("Error: Failed to get user info", error);
        localStorage.removeItem('token');
        navigate("/");
      }
    }
  }, [navigate]);

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <Navbar />
      <LoginOverlayButton />
      <RegisterOverlayButton />

      {/* Main Content Section */}
      <main className="home-content">
        <div className="home-section-main">
          MAIN {/* Placeholder for main content */}
        </div>
      </main>

      {/* Popup Display when showPopup state is true */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Student List</h2>
            <p>No student data available.</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;