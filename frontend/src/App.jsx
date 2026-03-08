import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Auth & General Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

// Rename these files in your folder to match these imports
import TermsAndConditions from "./pages/LegalTerms";
import PrivacyPolicy from "./pages/LegalPrivacy";

// Dashboard & Management Pages
import Dashboard from "@/pages/Dashboard";
import DashboardLayout from "@/layouts/DashboardLayout";
import Employees from "./pages/Employee";
import EmployeeAttendance from "./pages/EmployeeAttendance";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import AddStatus from "./pages/AddStatus";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Internal path names (URLs) are usually fine, it's the file names that get blocked */}
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          <Route
            path="/"
            element={<Navigate to="/employee-dashboard" replace />}
          />

          {/* ========== PROTECTED ROUTES WITH LAYOUT ========== */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/employee-dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route
              path="/employees/:id/attendance"
              element={<EmployeeAttendance />}
            />
            <Route path="/reports" element={<Reports />} />

            {/* ===== Super Admin and Manager ONLY ===== */}
            <Route
              path="/attendance"
              element={
                <ProtectedRoute allowedRoles={["superadmin", "manager"]}>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-status"
              element={
                <ProtectedRoute allowedRoles={["superadmin", "manager"]}>
                  <AddStatus />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ================= 404 ================= */}
          <Route
            path="*"
            element={<Navigate to="/employee-dashboard" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
