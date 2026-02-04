import { Navigate, Outlet } from "react-router-dom";

const FacultyAuthGuard = () => {
    // TEMP: For now, we assume the user is authorized as we are using hardcoded IDs.
    // In a real app, successful auth would check for a token or user role.
    const isAuthenticated = true; // Replace with actual auth logic
    const userRole = "FACULTY"; // Replace with actual role check

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (userRole !== "FACULTY") {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default FacultyAuthGuard;
