import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import DashboardLayout from "./components/DashboardLayout";
import Home           from "./pages/Home";
import Screener       from "./pages/Screener";
import Chatbot        from "./pages/Chatbot";
import About          from "./pages/About";
import Pipeline       from "./pages/Pipeline";
import Analytics      from "./pages/Analytics";
import Login          from "./pages/Login";
import Signup         from "./pages/Signup";
import Landing        from "./pages/Landing";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";
import VerifyEmail    from "./pages/VerifyEmail";

function ProtectedRoute({ children }) {
  return localStorage.getItem("user") ? children : <Navigate to="/" replace />;
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-7xl font-extrabold text-slate-200 mb-3">404</h1>
      <p className="text-slate-500 text-lg mb-6">Page not found.</p>
      <Link to="/home"
        className="px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold
          hover:bg-brand-500 transition-colors shadow-md shadow-brand-200">
        Go Home
      </Link>
    </div>
  );
}

function Dash({ children }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<Landing />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/signup"          element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/verify-email"    element={<VerifyEmail />} />

        <Route path="/home"     element={<Dash><Home /></Dash>} />
        <Route path="/screener" element={<Dash><Screener /></Dash>} />
        <Route path="/chatbot"  element={<Dash><Chatbot /></Dash>} />
        <Route path="/about"    element={<Dash><About /></Dash>} />
        <Route path="/pipeline"   element={<Dash><Pipeline /></Dash>} />
        <Route path="/analytics"  element={<Dash><Analytics /></Dash>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
