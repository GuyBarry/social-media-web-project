import { Google as GoogleIcon } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Panel } from "../../components/panel/panel";
import { useAuth } from "../../context/authContext";
import "./register.css";

export const RegisterScreen = () => {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    bio: "",
    birthdate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignup = async () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    await register(
      {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        bio: formData.bio,
        birthDate: new Date(formData.birthdate),
      },
      {
        onSuccess: () => navigate("/"),
        onError: () => setError("Registration failed"),
      },
    );

    setLoading(false);
  };

  return (
    <div className="register-container">
      {/* Left Panel - Desktop Visuals */}
      <Panel
        title="Join Us"
        subTitle="Create an account and start sharing your journey."
      />

      {/* Right Panel - Form */}
      <div className="register-form-panel">
        <div>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
            Create Account
          </Typography>
          <Typography color="text.secondary" textAlign="center" mb={3}>
            Start your journey with us today
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              margin="dense"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              margin="dense"
              required
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                margin="dense"
                required
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                margin="dense"
                required
              />
            </Box>

            <TextField
              fullWidth
              label="Birthdate"
              type="date"
              value={formData.birthdate}
              onChange={(e) =>
                setFormData({ ...formData, birthdate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell us about yourself"
              margin="dense"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Or continue with
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignup}
            sx={{ py: 1.5 }}
          >
            Google
          </Button>

          <Typography textAlign="center" mt={3}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ color: "primary.main", fontWeight: 600 }}
            >
              Sign in
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
};
