import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import "./Home.css";
import { getStudents } from '../services/api'; 

/**
 * Home Component
 * This component serves as the homepage layout.
 * It includes:
 * - A navigation bar (Navbar)
 * - A main content section
 * - A button to fetch and display students in a popup
 * - A footer (Footer)
 */
function Home() {
  const [students, setStudents] = useState([]); // Store student data
  const [showPopup, setShowPopup] = useState(false); // Manage popup visibility

  /**
   * Fetch student data from the backend and display it in a popup.
   * - Calls `getStudents()`, logs the first student's first name, and updates state.
   * - Ensures the popup opens after data is retrieved.
   */
  const handleFetchStudents = async () => {
    const data = await getStudents();

    if (data.length > 0) {
      console.log(data[0].firstName); // Log first student's name (for debugging)
    }

    setStudents(data);
    setShowPopup(true);
  };

  /** Close the popup when called */
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Section */}
      <main className="home-content">
        <div className="home-section-main">
          MAIN {/* Placeholder for main content */}

          {/* Button to fetch students and show the popup */}
          <button onClick={handleFetchStudents}>Get Students</button>
        </div>
      </main>

      {/* Popup Display (Only appears if showPopup is true) */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Student List</h2>

            {/* Handle cases where student data is empty */}
            {students.length > 0 ? (
              <ul>
                {students.map((student, index) => (
                  <li key={index}>{student.firstName}</li>
                ))}
              </ul>
            ) : (
              <p>No students found.</p>
            )}

            {/* Close button to hide the popup */}
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
