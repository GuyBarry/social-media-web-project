import { Google as GoogleIcon } from "@mui/icons-material";
import {
  Alert,
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
import "./login.css";

export const LoginScreen = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await login(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onError: () => setError("Login failed"),
      },
    );

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
  };

  return (
    <div className="login-container">
      {/* Left Panel - Desktop Visuals */}
      <Panel
        title="Welcome Back"
        subTitle="Sign in to continue your journey with us."
      />

      {/* Right Panel - Form */}
      <div className="login-form-panel">
        <div>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
            Sign In
          </Typography>
          <Typography color="text.secondary" textAlign="center" mb={2}>
            Enter your credentials to access your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
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
                "Sign In"
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
            onClick={handleGoogleLogin}
            sx={{ py: 1.5 }}
          >
            Google
          </Button>

          <Typography textAlign="center" mt={3}>
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{ color: "primary.main", fontWeight: 600 }}
            >
              Sign up
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
};
