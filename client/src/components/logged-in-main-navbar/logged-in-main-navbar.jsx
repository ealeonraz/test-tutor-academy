import logo from "../../assets/go-tutor-academy-logo.png";
import React from "react";
import profilepic from "../../assets/gohan-pic.webp";
import downarrow from "../../assets/down-arrow.png";

import "./logged-in-main-navbar.css";

export default function LoggedInMainNavbar() {
    return(
        <div className= "logged-in-main-navbar">
                <div className= "logo">
                    <img src={logo}></img>
                </div>
                <div className= "account-overlay">
                    <div className= "account-picture">
                        <img src={profilepic}></img>
                    </div>
                    <div className= "account-arrow-button">
                        <button Onclick><img src={downarrow}></img></button>
                    </div>
                </div>
        </div>
    );
}