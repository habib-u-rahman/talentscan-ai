import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { verifyEmail } from "../api/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [phase,   setPhase]   = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setPhase("error");
      setMessage("No verification token found. Please check the link in your email.");
      return;
    }
    verifyEmail(token)
      .then(data => {
        setPhase("success");
        setMessage(data.message || "Email verified successfully!");
      })
      .catch(err => {
        setPhase("error");
        setMessage(
          err?.response?.data?.detail ||
          "This verification link is invalid or has already been used."
        );
      });
  }, [token]);

  return (
    <AuthLayout>
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 p-10 auth-card text-center">

        {phase === "loading" && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-brand-50 border-2 border-brand-200
              flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-brand-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Verifying your email…</h2>
            <p className="text-sm text-slate-500">Please wait a moment.</p>
          </>
        )}

        {phase === "success" && (
          <div className="success-enter">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200
              flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Email Verified!</h2>
            <p className="text-sm text-slate-500 max-w-xs mx-auto mb-7 leading-relaxed">{message}</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 text-white
                text-sm font-bold rounded-xl hover:bg-brand-500 shadow-lg shadow-brand-300/40
                active:scale-[.98] transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              Sign In Now
            </Link>
          </div>
        )}

        {phase === "error" && (
          <div className="success-enter">
            <div className="w-16 h-16 rounded-2xl bg-red-50 border-2 border-red-200
              flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Verification Failed</h2>
            <p className="text-sm text-slate-500 max-w-xs mx-auto mb-7 leading-relaxed">{message}</p>
            <div className="flex flex-col items-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-7 py-3 bg-brand-600 text-white
                  text-sm font-bold rounded-xl hover:bg-brand-500 shadow-lg shadow-brand-300/40
                  active:scale-[.98] transition-all"
              >
                Back to Sign Up
              </Link>
              <Link to="/login"
                className="text-xs text-slate-500 font-medium hover:text-brand-600 transition-colors">
                Already verified? Sign in
              </Link>
            </div>
          </div>
        )}

      </div>
    </AuthLayout>
  );
}
