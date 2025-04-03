import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import ReviewSection from '../components/ReviewSection';
import RegisterOverlay from '../components/RegisterOverlayButton';
import CtaButtonOverlay from '../components/CtaButtonOverlay';
import CommunityButton from '../components/CommunityButton';
import HomeImage from '../assets/HomeImage131.webp';
import SmartSceduling from '../assets/SmartSceduling.webp';
import PTracking from '../assets/PTracking.webp';
import Pay from '../assets/Pay.webp';
import Book from '../assets/Book.webp';
import { 
  CalculatorIcon, 
  ScienceIcon, 
  BookIcon, 
  GlobeIcon, 
  ComputerIcon, 
  SchoolIcon,
  HistoryIcon,      // Existing subject
  ArtIcon,          // Existing subject
  MusicIcon,        // Existing subject
  LanguagesIcon,    // Existing subject
  ChemistryIcon,    // New subject
  BiologyIcon,      // New subject
  EconomicsIcon,    // New subject
  PhilosophyIcon    // New subject
} from '../components/Icons';
import './Home.css';

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

  return (
    <div className="home-container">
      <Navbar />

      {/* CTA / HERO SECTION */}
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

      {/* About & Subjects Section */}
      <section className="about-section">
        {/* About Us Content */}
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            Our tutoring platform connects students with expert tutors for personalized learning. 
            We believe in building confidence through knowledge, offering one-on-one sessions tailored to each student’s needs.
          </p>
          <p>
            With a focus on strong fundamentals and interactive teaching, we help learners excel in their courses and foster a love of learning.
          </p>
        </div>

        {/* Subjects We Tutor List */}
        <div className="subjects-list">
          <h2>Subjects We Tutor</h2>
          <ul>
            <li><CalculatorIcon /><span>Mathematics</span></li>
            <li><ScienceIcon /><span>Science</span></li>
            <li><BookIcon /><span>English Literature</span></li>
            <li><GlobeIcon /><span>Social Studies</span></li>
            <li><ComputerIcon /><span>Computer Science</span></li>
            <li><SchoolIcon /><span>Test Prep</span></li>
            <li><HistoryIcon /><span>History</span></li>
            <li><ArtIcon /><span>Art</span></li>
            <li><MusicIcon /><span>Music</span></li>
            <li><LanguagesIcon /><span>Foreign Languages</span></li>
            {/* New additional subjects */}
            <li><ChemistryIcon /><span>Chemistry</span></li>
            <li><BiologyIcon /><span>Biology</span></li>
            <li><EconomicsIcon /><span>Economics</span></li>
            <li><PhilosophyIcon /><span>Philosophy</span></li>
          </ul>
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

      {/* Our Impact Section */}
      <section id="impact" className="impact-section">
        <div className="impact-grid">
          <div className="impact-text">
            <h2>Our Impact</h2>
            <p>
              We empower learners and educators worldwide. Our platform fosters success by connecting students with dedicated tutors, resulting in thousands of productive sessions every day.
            </p>
            <button className="impact-btn" onClick={() => setShowPopup(true)}>
              Join Our Community
            </button>
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

      {/* Testimonials Section */}
      <section id="testimonials" className="section section-white">
        <ReviewSection />
      </section>

      {showPopup && <CommunityButton onClose={closePopup} />}
      <Footer />
    </div>
  );
}

export default Home;
