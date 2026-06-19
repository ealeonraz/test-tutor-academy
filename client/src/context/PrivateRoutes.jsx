import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = () => {
    const { authToken, loading } = useAuth();
    if (loading) return null; // wait for the session to hydrate before deciding
    if (!authToken) return <Navigate to="/" />;
    return <Outlet />;
}

export default PrivateRoute;
