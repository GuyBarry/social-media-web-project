import { Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/provider/authProvider";
import { ProtectedRoute } from "./components/protectedRoute/protectedRoute";
import { LoginScreen } from "./views/login/login";
import { RegisterScreen } from "./views/registeration/register";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        width={"100%"}
        minHeight={"100vh"}
      >
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <>hiiii</>
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
