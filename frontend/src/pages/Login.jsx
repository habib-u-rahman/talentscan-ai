import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginUser, resendVerification } from "../api/api";
import AuthLayout from "../components/AuthLayout";

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}

export default function Login() {
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [error,         setError]         = useState(null);
  const [success,       setSuccess]       = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [googleNote,    setGoogleNote]    = useState(false);
  const [shakeKey,      setShakeKey]      = useState(0);
  const [notVerified,   setNotVerified]   = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent,    setResendSent]    = useState(false);
  const nav      = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) setSuccess(location.state.message);
  }, [location.state]);

  const showError = msg => { setError(msg); setShakeKey(k => k + 1); };

  const submit = async () => {
    if (!email || !password) { showError("Please fill in all fields."); return; }
    setLoading(true); setError(null); setNotVerified(false);
    try {
      const r = await loginUser(email, password);
      localStorage.setItem("user", JSON.stringify(r.user || {}));
      nav("/home");
    } catch (e) {
      const detail = e.response?.data?.detail || "";
      if (detail === "EMAIL_NOT_VERIFIED") {
        setNotVerified(true);
      } else {
        showError(detail || "Incorrect email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendVerification(email);
      setResendSent(true);
    } catch {
      /* silently ignore */
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 p-6 auth-card">

        {/* Header */}
        <div className="text-center mb-4 field-1">
          <div className="w-11 h-11 rounded-2xl bg-brand-600 flex items-center justify-center
            mx-auto mb-2 shadow-md shadow-brand-300/40">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to your Talant Scan account</p>
        </div>

        {/* Success banner */}
        {success && (
          <div className="success-enter bg-emerald-50 border border-emerald-200 rounded-xl
            px-4 py-2 mb-3 flex items-center gap-2.5">
            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
            <span className="text-xs text-emerald-700 font-medium">{success}</span>
          </div>
        )}

        {/* Email not verified banner */}
        {notVerified && (
          <div className="success-enter bg-amber-50 border border-amber-200 rounded-xl
            px-4 py-3 mb-3">
            <div className="flex items-start gap-2.5 mb-2">
              <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                Your email address hasn't been verified yet. Please check your inbox and click the verification link.
              </p>
            </div>
            {resendSent ? (
              <p className="text-xs text-emerald-600 font-semibold pl-6">✓ New verification email sent!</p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendLoading || !email}
                className="ml-6 text-xs text-amber-700 font-bold underline underline-offset-2
                  hover:text-amber-900 transition-colors disabled:opacity-50"
              >
                {resendLoading ? "Sending…" : "Resend verification email"}
              </button>
            )}
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div key={shakeKey} className="shake bg-red-50 border border-red-100 rounded-xl
            px-4 py-2 mb-3 flex items-center gap-2.5">
            <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-xs text-red-600 font-medium">{error}</span>
          </div>
        )}

        {/* Google button */}
        <div className="field-2">
          <button
            onClick={() => setGoogleNote(true)}
            className="w-full flex items-center justify-center gap-3 border border-slate-200
              rounded-xl py-2.5 px-4 text-sm font-semibold text-slate-700 bg-white
              hover:bg-slate-50 hover:border-slate-300 active:scale-[.98] transition-all shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          {googleNote && (
            <p className="text-center text-[11px] text-slate-400 mt-2 success-enter">
              Google sign-in coming soon — use email &amp; password for now.
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="field-3 flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs text-slate-400 font-medium">or</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* Email */}
        <div className="space-y-4">
          <div className="field-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setNotVerified(false); setResendSent(false); }}
              onKeyDown={e => e.key === "Enter" && submit()}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800
                bg-slate-50/50 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>

          {/* Password */}
          <div className="field-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Password
              </label>
              <Link to="/forgot-password"
                className="text-xs text-brand-500 font-semibold hover:text-brand-600 hover:underline transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800
                bg-slate-50/50 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="field-5">
          <button
            onClick={submit}
            disabled={loading}
            className={`w-full mt-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200
              ${loading
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-300/40 active:scale-[.98]"}`}
          >
            {loading
              ? <span className="flex items-center justify-center gap-2"><Spinner />Signing in…</span>
              : "Sign In"}
          </button>

          <p className="text-center text-xs text-slate-400 mt-3">
            Don't have an account?{" "}
            <Link to="/signup" className="text-brand-600 font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>

      <p className="text-center text-[11px] text-slate-400 mt-2">
        By signing in you agree to our{" "}
        <span className="text-brand-500 cursor-pointer hover:underline">Terms</span>{" "}&amp;{" "}
        <span className="text-brand-500 cursor-pointer hover:underline">Privacy Policy</span>
      </p>
    </AuthLayout>
  );
}
