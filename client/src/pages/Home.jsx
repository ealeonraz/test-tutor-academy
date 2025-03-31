import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import "./Home.css";
import ReviewSection from '../components/ReviewSection';
import HomeImage from '../assets/HomeImage131.webp';
import RegisterOverlay from '../components/RegisterOverlayButton';
import CtaButtonOverlay from '../components/CtaButtonOverlay';
import SmartSceduling from '../assets/SmartSceduling.webp';
import PTracking from '../assets/PTracking.webp';
import Pay from '../assets/Pay.webp';
import Book from '../assets/Book.webp';
import { useNavigate } from 'react-router-dom';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isLoggedIn) {
      try {
        const decoded = parseJwt(token);
        if (decoded.role === "student") {
          navigate("/studentDashboard");
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
  }, [navigate, isLoggedIn]);

  return (
    <div className="home-container">
      <Navbar />

      {/* CTA BUTTON / HERO SECTION */}
      <section id="hero" className="section section-white">
        <div className="home-content">
          <div className="home-section-main">
            <div className="home-text">
              <h1 className="cta-heading">Learn More, Teach with Ease</h1>
              <p className="cta-description">
                A platform built for tutors and students to succeed by simplifying scheduling, tracking progress, and streamlining communication.
              </p>
              <CtaButtonOverlay />
            </div>
            <div className="home-image">
              <img src={HomeImage} alt="Home Visual" />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="about" className="section section-purple">
        <div className="about-container">
          <div className="about-text">
            <h2>About Us</h2>
            <p>
              At GoTutor Academy, we are dedicated to transforming education. Our platform streamlines tutoring—from scheduling sessions to tracking progress—ensuring a seamless experience for both students and tutors.
            </p>
            <p>
              We believe high-quality tutoring should be accessible and efficient, empowering every learner to reach their full potential.
            </p>
            <button className="about-btn">Learn More</button>
          </div>
          <div className="about-image">
            <img src="/assets/about-us.jpg" alt="About GoTutor Academy" />
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section id="what-we-offer" className="what-we-offer">
        <div className="offer-header">
          <h2>What We Offer</h2>
        </div>
        <div className="about-us-cards">
          <div className="about-card">
            <img src={SmartSceduling} alt="Smart Scheduling" />
            <h4>Smart Scheduling</h4>
            <p>Automated scheduling eliminates conflicts and ensures smooth session planning.</p>
          </div>
          <div className="about-card">
            <img src={PTracking} alt="Performance Tracking" />
            <h4>Performance Tracking</h4>
            <p>Track progress with real-time analytics and feedback tools.</p>
          </div>
          <div className="about-card">
            <img src={Pay} alt="Automated Payroll" />
            <h4>Automated Payroll</h4>
            <p>Simplify payment processing with accurate session tracking.</p>
          </div>
          <div className="about-card">
            <img src={Book} alt="Easy Booking" />
            <h4>Easy Booking</h4>
            <p>Quickly connect students with the right tutor for their needs.</p>
          </div>
        </div>
      </section>


      {/* OUR IMPACT SECTION */}
      <section id="impact" className="impact-section">
        <div className="impact-grid">
          <div className="impact-text">
            <h2>Our Impact</h2>
            <p>
              We empower learners and educators worldwide. Our platform fosters success by connecting students with dedicated tutors, resulting in thousands of productive sessions every day.
            </p>
            <button className="impact-btn">Join Our Community</button>
          </div>
          <div className="impact-stats">
            <div className="counter">
              <span className="number">5000+</span>
              <span className="label">Sessions</span>
            </div>
            <div className="counter">
              <span className="number">2000+</span>
              <span className="label">Students</span>
            </div>
            <div className="counter">
              <span className="number">150+</span>
              <span className="label">Tutors</span>
            </div>
          </div>
        </div>
      </section>




      {/* SEE WHAT OTHERS HAVE TO SAY SECTION (TESTIMONIALS) */}
      <section id="testimonials" className="section section-white">
        <ReviewSection />
      </section>

      {showPopup && <RegisterOverlay closePopup={closePopup} />}
      <Footer />
    </div>
  );
}

export default Home;
