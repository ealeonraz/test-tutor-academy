import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "./Home.css";


function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <main className="home-content">
        <div className="home-section-main">
          MAIN
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
