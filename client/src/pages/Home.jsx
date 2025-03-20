import React, { useEffect, useState} from 'react';
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
 * - A footer (Footer)
 */
function Home() {
  const[student, setStudents] = useState([]);
  const[showPopup, setShowPopup] = useState(false);

  const handleFetchStudents = async () => {
    const data = await getStudents();
    console.log(data[0].firstName)
    setStudents(data);
    setShowPopup(true);
  }
  const closePopup=()=>{
    setShowPopup(false);
  }
  
  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Section */}
      <main className="home-content">
        <div className="home-section-main">
          MAIN {/* Placeholder for main content */}
          <button onClick={handleFetchStudents}>
          
          </button>
        </div>
      </main>

      {/* Popup Display when showPopup state is true*/}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Student List</h2>
            <ul>
                <li>{student[0].firstName}</li>
            </ul>
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