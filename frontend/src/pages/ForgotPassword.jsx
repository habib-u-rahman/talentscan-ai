import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}

export default function ForgotPassword() {
  const [email,    setEmail]    = useState("");
  const [sent,     setSent]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [shakeKey, setShakeKey] = useState(0);

  const showError = msg => { setError(msg); setShakeKey(k => k + 1); };

  const submit = async () => {
    if (!email) { showError("Please enter your email address."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { showError("Please enter a valid email address."); return; }
    setLoading(true); setError(null);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthLayout>
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 p-8 auth-card">

        {!sent ? (
          <>
            {/* Header */}
            <div className="text-center mb-6 field-1">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center
                mx-auto mb-4 shadow-lg shadow-brand-300/40">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Forgot password?</h1>
              <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div key={shakeKey} className="shake bg-red-50 border border-red-100 rounded-xl
                px-4 py-3 mb-5 flex items-center gap-2.5">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-xs text-red-600 font-medium">{error}</span>
              </div>
            )}

            {/* Email field */}
            <div className="field-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800
                  bg-slate-50/50 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>

            {/* Button */}
            <div className="field-3">
              <button
                onClick={submit}
                disabled={loading}
                className={`w-full mt-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200
                  ${loading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-300/40 active:scale-[.98]"}`}
              >
                {loading
                  ? <span className="flex items-center justify-center gap-2"><Spinner />Sending link…</span>
                  : "Send Reset Link"}
              </button>

              <div className="text-center mt-5">
                <Link to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium
                    hover:text-brand-600 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Back to Sign In
                </Link>
              </div>
            </div>
          </>
        ) : (
          /* ── Success state ── */
          <div className="success-enter text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border-2 border-emerald-200
              flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Check your inbox</h2>
            <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed mb-1">
              We've sent a password reset link to
            </p>
            <p className="text-sm font-bold text-brand-600 mb-6">{email}</p>
            <p className="text-xs text-slate-400 mb-7">
              Didn't get it? Check your spam folder or{" "}
              <button onClick={() => setSent(false)}
                className="text-brand-500 font-semibold hover:underline">
                try again
              </button>.
            </p>
            <Link to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white
                text-sm font-bold rounded-xl hover:bg-brand-500 shadow-lg shadow-brand-300/40
                active:scale-[.98] transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
