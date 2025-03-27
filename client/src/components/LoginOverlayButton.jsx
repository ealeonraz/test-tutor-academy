import { useState } from "react";
import { NavLink } from "react-router-dom";
import React, { useRef } from "react";
import "./Overlay.css"

const LoginOverlay = () => {
    const dialogRef = useRef(null);

    const openDialog = () => {
        if (dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal(); // Ensure it's only called if it's not already open
        }
    };

    const closeDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
    };

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });


    const [errorMessage, setErrorMessage] = useState("");

    const updateForm = (e) => {
        const{name, value} = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]:value
        }));
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:4000/login", {
                method: "GET",
                headers: {
                    "ContentType": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                throw new error("Could not fetch database");
            }

         } catch(error) {
            console.error("Failed to log in");
         }
    }

    return (
        <>
            {/* Login Button */}
            <div className="nav-buttons">
                <button 
                  onClick={openDialog}
                  className="nav-button">
                    Log in
                </button>
            </div>
            
                {/* Login Overlay */}
                <div className="overlay-center">
                    <dialog 
                        ref={dialogRef} 
                        onClick={(e) => {
                            if (e.target === dialogRef.current) {
                            closeDialog();
                            }
                        }}>
                        <div className="login-flex">
                            <h1>Login</h1>
                            <form action="">
                                <label htmlFor="email" required>
                                    Email:
                                </label>
                                <input type="text" id="email" name="email"
                                    placeholder="name@example.com" 
                                    value={loginData.email}
                                    onChange={updateForm}
                                    required
                                />

                                <label htmlFor="password" required>
                                    Password:
                                </label>
                                <input type="password" id="password" name="password"
                                    placeholder="Enter password" 
                                    value={loginData.password}
                                    onChange={updateForm}
                                />

                                <button className="wide-black" onClick={onSubmit}>Sign In</button>
                            </form>
                            <a className="login-link">Forgot Password?</a>
                            <a className="login-link">Don't have an account?</a>

                        </div>
                    </dialog>
                </div>
        </>
    );
};

// escape key
//LoginOverlay.addEventListener()

export default LoginOverlay;