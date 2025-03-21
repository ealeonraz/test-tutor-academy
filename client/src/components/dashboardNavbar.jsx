import image from "../assets/go-tutor-academy-logo.png";
import profilepic from "../assets/gohan-pic.webp";
import downarrow from "../assets/down-arrow.png";

export default function StudentDashboardNavbar() {
  return (
  <div className="dashboard-nav-main">
    <div className = "logo">
        <img src={image}></img>
      </div>
    <div className ="dashboard-buttons-group">
      <div className="dashboard-button">
        Your Tutors
      </div>
      <div className="dashboard-button">
        Appointments
      </div>
      <div className="dashboard-button">
        Home
      </div>
      <div className="dashboard-button">
        Calendar
      </div>
      <div className="dashboard-button">
        Events
      </div>
    </div>
    <div className="account-overlay">
      <div className="account-picture">
        <img src={profilepic}></img>
      </div>
      <div className= "account-arrow-button">
        <img src={downarrow}></img>
      </div>
      <div className= "account-dropdown"></div>
    </div>
  </div>
);
}