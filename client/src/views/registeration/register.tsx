import { Google as GoogleIcon } from "@mui/icons-material";
import { CircularProgress, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Panel } from "../../components/panel/panel";
import { useAuth } from "../../auth/context/authContext";
import {
  RegisterAlert,
  RegisterContainer,
  RegisterDivider,
  RegisterFooterText,
  RegisterFormPanel,
  RegisterGoogleButton,
  RegisterLink,
  RegisterPasswordRow,
  RegisterSubmitButton,
  RegisterSubtitle,
  RegisterTitle,
} from "./register.styled";

export const RegisterScreen = () => {
  const { userId, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    uniqueUsername: "",
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
        uniqueUsername: formData.uniqueUsername,
        bio: formData.bio,
        birthDate: new Date(formData.birthdate),
      },
      {
        onError: () => setError("Registration failed"),
      },
    );

    setLoading(false);
  };

  return (
    <RegisterContainer>
      <Panel
        title="Join Us"
        subTitle="Create an account and start sharing your journey."
      />

      <RegisterFormPanel>
        <div>
          <RegisterTitle variant="h5">Create Account</RegisterTitle>
          <RegisterSubtitle color="text.secondary">
            Start your journey with us today
          </RegisterSubtitle>

          {error && <RegisterAlert severity="error">{error}</RegisterAlert>}

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

            <RegisterPasswordRow>
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
            </RegisterPasswordRow>

            <TextField
              fullWidth
              label="Birthdate"
              type="date"
              value={formData.birthdate}
              onChange={(e) =>
                setFormData({ ...formData, birthdate: e.target.value })
              }
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { max: new Date().toISOString().split("T")[0] },
              }}
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

            <RegisterSubmitButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </RegisterSubmitButton>
          </form>

          <RegisterDivider>
            <Typography variant="body2" color="text.secondary">
              Or continue with
            </Typography>
          </RegisterDivider>

          <RegisterGoogleButton
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignup}
          >
            Google
          </RegisterGoogleButton>

          <RegisterFooterText>
            Already have an account?{" "}
            <RegisterLink component={Link} to="/login">
              Sign in
            </RegisterLink>
          </RegisterFooterText>
        </div>
      </RegisterFormPanel>
    </RegisterContainer>
  );
};
