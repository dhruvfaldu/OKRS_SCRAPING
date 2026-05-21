import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Home from "../pages/Home.jsx";
import CreateJobPage from "../pages/CreateJobPage.jsx";
import ResultsPage from "../pages/ResultsPage.jsx";
import NotFound from "../components/common/NotFound.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import JobsPage from "../pages/JobsPage.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    {/* ── Protected Routes ── */}
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/create" element={<ProtectedRoute><CreateJobPage /></ProtectedRoute>} />
                    <Route path="/results/:id" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />

                    {/* ── Public Routes (popup overlay — app visible behind) ── */}
                    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                    <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
                    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                    <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

                    {/* ── Jobs page ── */}
                    <Route path="/jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
