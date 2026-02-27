import { Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/provider/authProvider";
import { AppLayout } from "./components/layout/layout";
import { ProtectedRoute } from "./components/protectedRoute/protectedRoute";
import { HomeScreen } from "./views/home/home";
import { LoginScreen } from "./views/login/login";
import { RegisterScreen } from "./views/registeration/register";
import { ProfileScreen } from "./views/profile/profile";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack width={"100%"} minHeight={"100vh"}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <HomeScreen />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ProfileScreen />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register"
                element={<RegisterScreen></RegisterScreen>}
              />
              <Route path="/login" element={<LoginScreen></LoginScreen>} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </Stack>
    </LocalizationProvider>
  );
}

export default App;
