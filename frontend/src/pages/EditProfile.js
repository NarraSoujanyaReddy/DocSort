import React, { useState, useEffect } from "react";
import { getAuth, updateProfile, updateEmail } from "firebase/auth";
import { TextField, Button, Typography, Paper, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css"; // Import the CSS file

const EditProfile = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        displayName: "",
        email: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Load current user details into the form
    useEffect(() => {
        if (user) {
            setProfile({
                displayName: user.displayName || "",
                email: user.email || "",
            });
        }
    }, [user]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    // Handle profile submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            if (user) {
                // Update display name
                await updateProfile(user, { displayName: profile.displayName });

                // Update email if it has changed
                if (user.email !== profile.email) {
                    await updateEmail(user, profile.email);
                }

                setMessage("Profile updated successfully!");
                setTimeout(() => navigate("/", { replace: true }), 2000); // Redirect after 2 seconds
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(`Error: ${err.message}`);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 5 }} className="edit-profile-container">
                <Typography variant="h4" gutterBottom>
                    Edit Profile
                </Typography>

                {message && (
                    <Typography variant="body1" color="success.main" gutterBottom>
                        {message}
                    </Typography>
                )}
                {error && (
                    <Typography variant="body1" color="error.main" gutterBottom>
                        {error}
                    </Typography>
                )}

                <form onSubmit={handleSubmit}>
                    <Box mb={3}>
                        <TextField
                            fullWidth
                            label="Display Name"
                            name="displayName"
                            value={profile.displayName}
                            onChange={handleChange}
                            variant="outlined"
                            required
                        />
                    </Box>
                    <Box mb={3}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={profile.email}
                            onChange={handleChange}
                            variant="outlined"
                            required
                        />
                    </Box>
                    <Button type="submit" variant="contained" color="primary" className="edit-profile-button">
                        Save Changes
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default EditProfile;
