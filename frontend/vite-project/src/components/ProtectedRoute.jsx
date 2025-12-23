import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if(!token) {
        //reinderezza a /auth
        return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />; //renderezzi le rette "figlie"
}