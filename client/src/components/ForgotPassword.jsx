import React, { useState, useRef } from "react";
import { requestPasswordReset } from "../api/auth";
import "./Overlay/Overlay.css";

const ForgotPassword = () => {
  const dialogRef = useRef(null);

  const [registerData, setRegisterData] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  const openDialog = () => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  };

  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // DEBUG
    console.log("Email:", email);


    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
        const result = await requestPasswordReset(email);
        setMessage(result.message || "Reset link sent. Please check your email.");
        setEmail("");

      } catch (error) {
        console.error("Password reset failed:", error);
        setErrorMessage("Something went wrong. Please try again.");
      }
  };

  return (
    <>
      <a className="login-link" onClick={openDialog}>
        Forgot Password?
      </a>

      <div className="overlay-center">
        <dialog
          ref={dialogRef}
          onClick={(e) => {
            if (e.target === dialogRef.current) {
              closeDialog();
            }
          }}
        >
          <div className="login-flex">
            <h1>Forgot Password</h1>
            <form onSubmit={onSubmit}>

              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@example.com"
                value={registerData.email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {errorMessage && <div className="error-message">{errorMessage}</div>}
              {message && <div className="success-message">{message}</div>}

              <button type="submit" className="wide-black">
                Reset Password
              </button>
            </form>
          </div>
        </dialog>
      </div>
    </>
  );
};

export default ForgotPassword;
