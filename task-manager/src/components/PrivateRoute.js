import React from "react";
import { Navigate, Outlet } from 'react-router-dom';


const PrivateRoute = () => {
    var isLogin;
    var existedToken = localStorage.getItem("token");

    if (!existedToken) {
        return <Navigate to="/login" />;
    }
    return <Outlet />; //show existing route
}
export default PrivateRoute;