import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Import a user icon from FontAwesome

const ProfileMenu = () => {
    const { currentUser } = useContext(AuthContext); // Fetch logged-in user info
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login"); // Redirect to login page
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <div className="header-container">
            {/* Profile Section */}
            <div className="profile-menu">
                <div onClick={toggleMenu} className="profile-name">
                    <FaUserCircle size={24} className="user-icon" /> {/* User Icon */}
                    <span>{currentUser?.displayName || "User"}</span> ▼
                </div>
                {menuOpen && (
                    <div className="menu-dropdown">
                        <ul>
                            <li onClick={() => navigate("/edit-profile")}>Edit Profile</li>
                            <li onClick={() => navigate("/settings")}>Settings</li>
                            <li onClick={() => navigate("/feedback")}>Feedback</li>
                            <li onClick={handleLogout}>Logout</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileMenu;