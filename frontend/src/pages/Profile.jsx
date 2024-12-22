import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate("/"); // Navigate to the home page
        window.location.reload(); // Force a page refresh
    };

    return (
        <div className="w-full h-full min-h-screen flex items-center justify-center">
            <button onClick={handleLogout} className="bg-pink-100 p-2">Logout</button>
        </div>
    );
};
