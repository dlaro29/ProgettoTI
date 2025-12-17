import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if(!token) {
        //reinderezza a /login
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />; //renderezzi le rette "figlie"
}