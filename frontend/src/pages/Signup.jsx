import { useState } from "react";
import { Link } from "react-router-dom";
import { signupUser, resendVerification } from "../api/api";
import AuthLayout from "../components/AuthLayout";

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}

export default function Signup() {
  const [name,         setName]         = useState("");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [error,        setError]        = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [googleNote,   setGoogleNote]   = useState(false);
  const [shakeKey,     setShakeKey]     = useState(0);
  const [done,         setDone]         = useState(false);
  const [resendSent,   setResendSent]   = useState(false);
  const [resendLoading,setResendLoading]= useState(false);

  const showError = msg => { setError(msg); setShakeKey(k => k + 1); };

  const submit = async () => {
    if (!name || !email || !password) { showError("Please fill in all fields."); return; }
    if (password.length < 6) { showError("Password must be at least 6 characters."); return; }
    setLoading(true); setError(null);
    try {
      await signupUser(name, email, password);
      setDone(true);
    } catch (e) {
      showError(e.response?.data?.detail || "Signup failed. Please try again.");
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

  const handleKey = e => e.key === "Enter" && submit();

  /* ── Success: check your email ── */
  if (done) {
    return (
      <AuthLayout>
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 p-8 auth-card">
          <div className="success-enter text-center py-2">

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-brand-50 border-2 border-brand-200
              flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Check your inbox!</h2>
            <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed mb-1">
              We sent a verification link to
            </p>
            <p className="text-sm font-bold text-brand-600 mb-5">{email}</p>

            {/* Steps */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left mb-6 space-y-3">
              {[
                ["1", "Open the email from TalantScan AI"],
                ["2", "Click the \"Verify Email Address\" button"],
                ["3", "Come back here and sign in"],
              ].map(([n, label]) => (
                <div key={n} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs
                    font-extrabold flex items-center justify-center flex-shrink-0">
                    {n}
                  </span>
                  <span className="text-sm text-slate-600">{label}</span>
                </div>
              ))}
            </div>

            {/* Resend */}
            {resendSent ? (
              <p className="text-xs text-emerald-600 font-semibold mb-4">
                ✓ New verification email sent!
              </p>
            ) : (
              <p className="text-xs text-slate-400 mb-4">
                Didn't receive it?{" "}
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-brand-500 font-semibold hover:underline disabled:opacity-50"
                >
                  {resendLoading ? "Sending…" : "Resend email"}
                </button>
              </p>
            )}

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-7 py-3 bg-brand-600 text-white
                text-sm font-bold rounded-xl hover:bg-brand-500 shadow-lg shadow-brand-300/40
                active:scale-[.98] transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Go to Sign In
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  /* ── Sign-up form ── */
  return (
    <AuthLayout>
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 p-6 auth-card">

        {/* Header */}
        <div className="text-center mb-4 field-1">
          <div className="w-11 h-11 rounded-2xl bg-brand-600 flex items-center justify-center
            mx-auto mb-2 shadow-md shadow-brand-300/40">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Create an account</h1>
          <p className="text-sm text-slate-400 mt-1">Join Talant Scan to start screening resumes</p>
        </div>

        {/* Error */}
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
            Sign up with Google
          </button>
          {googleNote && (
            <p className="text-center text-[11px] text-slate-400 mt-2 success-enter">
              Google sign-up coming soon — use email &amp; password for now.
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="field-3 flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs text-slate-400 font-medium">or</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div className="field-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
              Full Name
            </label>
            <input type="text" placeholder="John Doe" value={name}
              onChange={e => setName(e.target.value)} onKeyDown={handleKey}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800
                bg-slate-50/50 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
          <div className="field-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
              Email
            </label>
            <input type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)} onKeyDown={handleKey}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800
                bg-slate-50/50 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
          <div className="field-5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
              Password
            </label>
            <input type="password" placeholder="•••••••• (min 6 chars)" value={password}
              onChange={e => setPassword(e.target.value)} onKeyDown={handleKey}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800
                bg-slate-50/50 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={submit}
          disabled={loading}
          className={`w-full mt-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200
            ${loading
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-300/40 active:scale-[.98]"}`}
        >
          {loading
            ? <span className="flex items-center justify-center gap-2"><Spinner />Creating account…</span>
            : "Create Account"}
        </button>

        <p className="text-center text-xs text-slate-400 mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-600 font-bold hover:underline">Sign in</Link>
        </p>
      </div>

      <p className="text-center text-[11px] text-slate-400 mt-2">
        By signing up you agree to our{" "}
        <span className="text-brand-500 cursor-pointer hover:underline">Terms</span>{" "}&amp;{" "}
        <span className="text-brand-500 cursor-pointer hover:underline">Privacy Policy</span>
      </p>
    </AuthLayout>
  );
}
